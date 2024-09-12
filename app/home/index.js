import { StyleSheet, Text, View, Pressable, Platform, Image, Modal, Alert } from 'react-native';
import React, { useEffect, useState, useRef, memo, useCallback, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome, Entypo, MaterialIcons, Feather } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { wp, hp } from '../../helpers/common';
import Slider from '@react-native-community/slider';
import Categories from '../../components/categories';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';
import Toast from 'react-native-toast-message';
import Canvas from 'react-native-canvas';
import * as MediaLibrary from 'expo-media-library';
import { ChooseCropPhoto } from '../../helpers/imagePicker';

const HomeScreen = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [activeCategory, setActiveCategory] = useState(null);
  const [pickImage, setPickImage] = useState(null);
  const [imageScale, setImageScale] = useState(0.85);
  const [modalVisible, setModalVisible] = useState(false);
  const imageRef = useRef();
  const canvasRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [activeCategory, pickImage, imageScale]);


  // const handleChangeCategory = (image) => {
  //   setActiveCategory(image);
  // };

  const handleChangeCategory = useCallback((image) => {
    setActiveCategory(image);
  }, []);


  const openImagePicker = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        multiple: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPickImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error launching image library:', error);
      Alert.alert('Image Picker Error', error.message);
    }
  }, []);

  // const handleEditImage = async () => {
  //   await ChooseCropPhoto(pickImage);
  //   setModalVisible(false);
  // };

  const handleEditImage = useCallback(async () => {
    try {
      const cropImage = await ChooseCropPhoto(pickImage);
      setModalVisible(false);
      if (cropImage?.uri) {
        setPickImage(cropImage);  // Ensure the URI is set correctly
      } else {
        console.error("No URI found after cropping");
      }
    } catch (error) {
      console.error("Error editing image", error);
    }
  }, [pickImage]);


  const saveData = async () => {
    try {
      const data = {
        pickImage,
        activeCategory,
        imageScale,
      };
      await AsyncStorage.setItem('imageData', JSON.stringify(data));
      // console.log('Data saved:', JSON.stringify(data, null, 2));
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
        setImageScale(imageScale || 0.85);
      }
    } catch (error) {
      console.error('Failed to load data from AsyncStorage', error);
    }
  };

  const deleteImage = useCallback(() => {
    setPickImage(null);
    setImageScale(0.85);
  }, []);

  const downloadImage = useCallback(async () => {
    if (!pickImage) {
      Toast.show({
        type: 'error',
        text1: 'No Image Selected',
      });
      return;
    }

    try {
      const uri = await captureRef(imageRef, {
        format: 'png',
        quality: 1.0,
      });

      const fileUri = FileSystem.documentDirectory + 'downloaded_image.png';
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to save images to the gallery.');
        return;
      }

      await MediaLibrary.createAssetAsync(fileUri);
      Toast.show({
        type: 'success',
        text1: 'Image Saved',
        text2: 'The image has been saved to your gallery.',
      });
    } catch (error) {
      console.error('Failed to save the image', error);
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'Failed to save the image. Please try again.',
      });
    }
  }, [pickImage]);


  const imageStyles = useMemo(() => [
    styles.selectedImage,
    { transform: [{ scale: imageScale }] },
  ], [imageScale]);


  const toastConfig = {
    success: ({ text1, props, ...rest }) => (
      <View style={styles.toast}>
        <Text style={styles.toastTxt}>{text1}</Text>
      </View>
    ),
    error: ({ text1, text2, ...rest }) => (
      <View style={styles.errorToast}>
        <Image source={require('../../assets/images/picture.png')}
          style={styles.noImageSelected}
        />
        <Text style={styles.errorToastTxt}>{text1}</Text>
        {/* <Text style={styles.errorToastTxt}>{text2}</Text> */}
        <Pressable hitSlop={30} onPress={openImagePicker} style={styles.addBtnImage}>
          <Text style={{ alignSelf: 'center', color: '#fff' }}>Select</Text>
        </Pressable>
      </View>
    ),
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable
          hitSlop={30}
          onPress={() => router.push('home/setting')}
        >
          <Ionicons name="settings" size={23} color={theme.colors.white} />
        </Pressable>
        <Pressable hitSlop={30} onPress={downloadImage}>
          <Ionicons name="download" size={23} color={theme.colors.white} />
        </Pressable>
      </View>
      <View style={styles.body}>
        <View style={styles.image} ref={imageRef}>
          {!activeCategory && !pickImage && (
            <FontAwesome name="user" size={100} color={theme.colors.darkgray} />
          )}
          {activeCategory && (
            <Image source={activeCategory} style={styles.selectedImage} />
          )}
          {pickImage && (
            <Image
              source={pickImage}
              style={imageStyles}
            />
          )
          }
        </View>
        <Pressable hitSlop={30} onPress={() => (pickImage ? setModalVisible(true) : openImagePicker())} style={styles.iconContainer}>
          <Feather name={pickImage ? 'edit-2' : 'plus'} size={20} color={theme.colors.black} />
        </Pressable>
        <View style={styles.slider}>
          <Text style={styles.sliderTxt}>Border Width</Text>
          <Slider
          // style={{ width: 320, transform: [{ scaleY: 2 }] }}
            style={styles.sliderLine}
            thumbTintColor="#FFFFFF"
            minimumValue={1}
            maximumValue={0}
            value={imageScale}
            onValueChange={useCallback((value) => setImageScale(value), [])}
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
            <View style={{ height: hp(0.1), width: wp(100), backgroundColor: theme.colors.blackgray }}></View>
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
      <Canvas ref={canvasRef} style={{ width: 300, height: 300, opacity: 0, position: 'absolute', zIndex: -1 }} />
      <Toast config={toastConfig} visibilityTime={2500} />

    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    backgroundColor: theme.colors.blackgray,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
    width: wp(72),
    height:  hp(34),
    borderRadius: theme.radius.xxxl,
    backgroundColor: theme.colors.defaultblack,
    overflow: 'hidden',
  },
  selectedImage: {
    position: 'absolute',
    width:  wp(72),
    height:  hp(34),
    borderRadius: theme.radius.xxxl,
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
    borderRadius: theme.radius.xxxl,
    backgroundColor: theme.colors.white,
    bottom:  hp(7),
    left:  wp(23),
  },
  slider: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderLine: {
    width: wp(100),
    height: 15,
    marginVertical: 10,
  },
  sliderTxt: {
    alignSelf: 'flex-start',
    marginHorizontal: hp(2),
    fontSize: hp(2),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.white,
  },
  categories: {
    height:  hp(45),
    width: wp(100),
    marginTop: wp(5),
    paddingVertical: wp(3),
    backgroundColor: theme.colors.defaultblack,
    borderTopRightRadius: theme.radius.xxl,
    borderTopLeftRadius: theme.radius.xxl,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',

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
  textStyle: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.extrabold,
    textAlign: 'center',
  },
  // buttonClose:{
  //   borderBottomColor: '#000',
  //   borderBottomWidth: 1,
  //   justifyContent:'center',
  // }
  editDeletContainer: {
    width: wp(90),
    height: hp(18),
    backgroundColor: '#D1CEC8',
    borderRadius: 10,
    overflow: 'hidden',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: hp(1.2),
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
  errorToast: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#DEE9EB',
    borderRadius: theme.radius.sm,
    height: hp(10),
    width: wp(90),
    // gap:15
  },
  errorToastTxt: {
    fontSize: hp(2),
    color: theme.colors.black,
    fontWeight: theme.fontWeights.bold,
    alignSelf: 'center',
  },
  toast: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8EC499',
    borderRadius: theme.radius.sm,
    height: hp(10),
    width: wp(90)
  },
  toastTxt: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
    alignSelf: 'center',
  },
  noImageSelected: {
    width: wp(10),
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnImage: {
    width: wp(13),
    height: hp(4.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.black,
    borderRadius: theme.radius.sm,

  }
});
