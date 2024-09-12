import { StyleSheet, Text, View, Pressable, Platform, Image, Modal, Alert } from 'react-native';
import React, { useEffect, useState, useRef, memo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome, Entypo, MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { wp, hp } from '../../helpers/common';
import Slider from '@react-native-community/slider';
import Categories from '../../components/categories';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import Canvas from '../../helpers/Canvas.web';
import domtoimage from 'dom-to-image';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [activeCategory, setActiveCategory] = useState(null);
  const [pickImage, setPickImage] = useState(null);
  const [imageScale, setImageScale] = useState(0.85); // Default to 1.0 for full scale
  const [modalVisible, setModalVisible] = useState(false);
  const imageRef = useRef();
  const canvasRef = useRef(null);
  const navigation = useNavigation();
  console.log("imageRef", imageRef);

  useEffect(() => {
    loadData();
    const croppedImageUri = router.query?.croppedImageUri;
    if (croppedImageUri) {
      setPickImage({ uri: croppedImageUri });
    }
  }, [router.query?.croppedImageUri]);


  useEffect(() => {
    saveData();
  }, [activeCategory, pickImage, imageScale]);

  const handleChangeCategory = useCallback((image) => {
    setActiveCategory(image);
  }, []);

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        multiple: false,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true
      });

      if (!result.canceled) {
        setPickImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error launching image library:', error);
      Alert.alert('Image Picker Error', error.message);
    }
  };


  // const handleEditImage = useCallback(async () => {
  //   console.log('Editing image...');
  //   let cropImage = await ChooseCropPhoto(pickImage);
  //   if (cropImage) {
  //     console.log('Image edited:', cropImage.uri);
  //     setPickImage({ uri: cropImage.uri });
  //   } else {
  //     console.log('Image editing was canceled or failed.');
  //   }
  //   setModalVisible(false);
  // }, [pickImage]);

  const handleEditImage = useCallback(() => {
    setModalVisible(false);
    if (pickImage) {
      router.push({
        pathname: '/home/ImageEditScreen',
        query: { imageUri: pickImage.uri }, // Use query instead of params
      });
    }
  }, [pickImage, router]);

  const saveData = async () => {
    try {
      const data = {
        pickImage,
        activeCategory,
        imageScale,
      };
      await AsyncStorage.setItem('imageData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data to AsyncStorage', error);
    }
  };

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('imageData');
      if (storedData) {
        const { pickImage, activeCategory, imageScale } = JSON.parse(storedData);
        setPickImage(pickImage || null);
        setActiveCategory(activeCategory || null);
        setImageScale(imageScale || 0.85); // Default to 1.0 for full scale
      }
    } catch (error) {
      console.error('Failed to load data from AsyncStorage', error);
    }
  };

  const deleteImage = () => {
    setPickImage(null);
    setImageScale(0.85); // Reset to default scale
  };

  const downloadImage = async () => {
    if (!pickImage) {
      Toast.show({
        type: 'error',
        text1: 'No Image Selected',
      });
      return;
    }
    else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          height: 230,
          width: 230,

        });

        let link = document.createElement('a');
        link.download = 'download.jpeg';
        link.href = dataUrl;
        link.click();
        Toast.show({
          type: 'success',
          text1: 'Image Saved',
          text2: 'The image has been saved to your gallery.',
        });
      } catch (e) {
        console.log(e);
        Toast.show({
          type: 'error',
          text1: 'Save Failed',
          text2: 'Failed to save the image. Please try again.',
        });
      }
    }
  };



  const toastConfig = {
    success: ({ text1 }) => (
      <View style={styles.toast}>
        <Text style={styles.toastTxt}>{text1}</Text>
      </View>
    ),
    error: ({ text1 }) => (
      <View style={styles.errorToast}>
        <Image source={require('../../assets/images/picture.png')} style={styles.noImageSelected} />
        <Text style={styles.errorToastTxt}>{text1}</Text>
        <Pressable hitSlop={30} onPress={openImagePicker} style={styles.addBtnImage}>
          <Text style={{ alignSelf: 'center', color: '#fff' }}>Select</Text>
        </Pressable>
      </View>
    ),
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable hitSlop={30} onPress={() => router.push('home/setting')}>
          <Ionicons name="settings" size={40} color={theme.colors.white} />
        </Pressable>
        <Pressable hitSlop={30} onPress={downloadImage}>
          <Ionicons name="download" size={40} color={theme.colors.white} />
        </Pressable>
      </View>
      <View style={styles.body}>
        <View ref={imageRef} collapsable={false} style={[styles.image, { backgroundColor: 'rgba(52, 52, 52, 0.8)' }]} >

          {!activeCategory && !pickImage && (
            <FontAwesome name="user" size={100} color={theme.colors.darkgray} />
          )}
          {activeCategory && (
            <Image source={activeCategory} style={styles.selectedImage} />
          )}
          {pickImage && (
            <Image
              source={{ uri: pickImage.uri }}
              style={[
                styles.selectedImage,
                { transform: [{ scale: imageScale }] },
              ]}
            />
          )
          }

        </View>
        {pickImage ? (
          <Pressable hitSlop={30} onPress={() => setModalVisible(true)} style={styles.iconContainer}>
            <MaterialIcons name='edit' size={30} color={theme.colors.black} />
          </Pressable>
        ) : (
          <Pressable hitSlop={30} onPress={openImagePicker} style={styles.iconContainer}>
            <Entypo name="plus" size={30} color={theme.colors.black} />
          </Pressable>
        )}
        <View style={styles.slider}>
          <Text style={styles.sliderTxt}>Border Width</Text>
          <Slider
            style={styles.sliderLine}
            thumbTintColor="#FFFFFF"
            minimumValue={0.1}
            maximumValue={1}
            value={imageScale}
            onValueChange={(value) => setImageScale(value)}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#e5e5e5"
          />
        </View>
        <View style={styles.categories}>
          <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.editDeletContainer}>
            <Pressable
              hitSlop={30}
              onPress={handleEditImage}
            >
              <Text style={[styles.textStyle, { color: theme.colors.blue }]}>Edit</Text>
            </Pressable>
            <View style={{ height: hp(0.1), width: '100%', backgroundColor: theme.colors.blackgray }}></View>
            <Pressable
              hitSlop={30}
              onPress={() => {
                setModalVisible(false);
                setPickImage();
                deleteImage();
              }}
            >
              <Text style={styles.textStyle}>Delete</Text>
            </Pressable>
          </View>
          <Pressable
            hitSlop={30}
            style={[styles.button]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={[styles.textStyle, { color: theme.colors.blue }]}>Cancel</Text>
          </Pressable>

        </View>
      </Modal>
      <Canvas ref={canvasRef} style={{ opacity: 0, position: 'absolute', zIndex: -1, backgroundColor: 'red' }} />

      <Toast config={toastConfig} />
    </View>
  );
};

export default memo(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    backgroundColor: theme.colors.blackgray,
    paddingHorizontal: 15,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '65%', // Reduce width to 80%
    alignItems: 'center',
  },
  body: {
    flex: 1,
    gap: 20,
    width: '80%', // Reduce width to 80%
    alignItems: 'center', // Center items inside body
  },

  slider: {
    gap: 10,
    paddingHorizontal: 20,
    width: '80%', // Reduce width to 80%
  },
  sliderTxt: {
    fontSize:20,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  sliderLine: {
    height: 40,
  },
  categories: {
    paddingHorizontal: 15,
    flex: 1,
    width: '80%', // Reduce width to 80%
    backgroundColor: theme.colors.defaultblack,
    borderTopRightRadius: theme.radius.xxl,
    borderTopLeftRadius: theme.radius.xxl,
    // alignItems: 'center', // Center content inside categories
  },
  textStyle: {
    fontSize:18,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.extrabold,
    textAlign: 'center',
  },
  button: {
    width: wp(90),
    height: hp(7),
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: hp(3),
    justifyContent: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    // marginBottom:20
  },
  editDeletContainer: {
    width: '63%', // Reduce width to 80%
    height: hp(18),
    backgroundColor: '#D1CEC8',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: hp(2),
    flexDirection: 'column',
  },
  button: {
    width: '63%', // Reduce width to 80%
    height: hp(7),
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(3),
  },
  modalView: {
    width: wp(90),
    height: hp(20),
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: hp(5),
    // bordeWidth:wp(5),

  },
  modalText: {
    textAlign: 'center',
    fontSize: 18,
  },
  // textStyle: {
  //   color: theme.colors.primary,
  //   fontWeight: theme.fontWeights.extrabold,
  //   textAlign: 'center',
  // },
  iconContainer: {
    width: 50,
    height: 50,
    // position: 'absolute',
    // top: '20%',
    // left:Platform.OS === 'web' ?'52%' :  'auto',
    padding: 10,
    borderRadius: 30,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    left: '5%',
    bottom: '7%',
  },
  toast: {
    // backgroundColor: theme.colors.blue,
    // paddingHorizontal: 20,
    // paddingVertical: 15,
    // borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8EC499',
    borderRadius: theme.radius.sm,
    height: 50,
    width: '50%'
  },
  toastTxt: {
    color: theme.colors.black,
    fontWeight: theme.fontWeights.bold,
    alignSelf: 'center',
  },
  errorToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // gap: 10,
    backgroundColor: '#DEE9EB',
    // paddingHorizontal: 20,
    // paddingVertical: 15,
    borderRadius: 15,
    height: '10%',
    width: '50%',
  },
  noImageSelected: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  errorToastTxt: {
    fontSize: hp(2),
    color: theme.colors.black,
    fontWeight: theme.fontWeights.bold,
    alignSelf: 'center',
  },
  addBtnImage: {
    backgroundColor: theme.colors.black,
    padding: 15,
    borderRadius: 20,
    width: wp(25),
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    borderRadius: 250,
    height: 300,
    width: 300,
    overflow: 'hidden',
    position: 'absolute',
  },
  image: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 250,
    height: 300,
    width: 300,
    overflow: 'hidden',
  },
});
