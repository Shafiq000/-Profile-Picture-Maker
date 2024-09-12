import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'
import * as ImageManipulator from 'expo-image-manipulator';

const ImageEdit = () => {
  const router = useRouter();
  const [rotation, setRotation] = useState(0);
  const navigation = useNavigation();
  const [pickImage, setPickImage] = useState(null);

  useEffect(() => {
    (async () => {
      const storedData = await AsyncStorage.getItem('imageData');
      if (storedData) {
        const { pickImage } = JSON.parse(storedData);
        setPickImage(pickImage);
      }
    })();
  }, []);

  const rotateLeft = () => setRotation(rotation - 90);
  const rotateRight = () => setRotation(rotation + 90);
  const resetImage = () => setRotation(0);

  // const cropImage = async () => {
  //   try {
  //     const croppedImage = await ImageManipulator.manipulateAsync(
  //       pickImage.uri
  //       [{ crop: { originX: 0, originY: 0, width: 300, height: 300 } }],
       
  //     );
  //     // console.log("crop", pickImage.uri,);
      
  //     setPickImage({ uri: croppedImage.uri });
  //   } catch (error) {
  //     console.error('Error cropping image:', error);
  //   }
  // };
  // const crop = async () => {
  //   try {
  //     const croppedImage = await ImageManipulator.manipulateAsync(
  //       pickImage.uri,
  //       [{
         
  //           crop: {
  //             originX: 50,  // Start cropping 50 pixels from the left
  //             originY: 50,  // Start cropping 50 pixels from the top
  //             width: 200,   // Crop a 200-pixel wide section
  //             height: 200   // Crop a 200-pixel tall section
  //           }
         
  //       }],
  //       { compress: 1, format: ImageManipulator.SaveFormat.PNG }
  //     );
  //     setPickImage({ uri: croppedImage.uri, width: croppedImage.width, height: croppedImage.height });
  //   } catch (error) {
  //     console.error('Error cropping image:', error);
  //   }
  // };
  const crop = async () => {
    try {
      const croppedImage = await ImageManipulator.manipulateAsync(
        pickImage.uri,
        [{
         
            crop: {
              originX: 50,  // Start cropping 50 pixels from the left
              originY: 50,  // Start cropping 50 pixels from the top
              width: 200,   // Crop a 200-pixel wide section
              height: 200   // Crop a 200-pixel tall section
            }
         
        }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      setPickImage({ uri: croppedImage.uri, width: croppedImage.width, height: croppedImage.height });
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  // const crop = async () => {
  //   ImagePicker.openCropper({
  //     path: pickImage,
  //     width: 300,
  //     height: 400
  //   }).then(image => {
  //     console.log(image);
  //   });
  // };

  const handleSaveEditedImage = async () => {
    if (pickImage) {
     const j = await AsyncStorage.setItem(
        'editedImageData',
        JSON.stringify({ editedImageUri: pickImage.uri, rotation })
      );
       console.log("hgh",j);
           
     router.push({
        pathname: '/home', 
        params: { editedImageUri: pickImage.uri, rotation },
      });
    }
  };

  if (!pickImage || !pickImage.uri) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No image selected to edit.</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.actionButton}>
          <Text style={styles.cancelButton}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pickImage.uri }}
          style={[
            styles.image,
            { transform: [{ rotate: `${rotation}deg` }] },
          ]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.actionsContainer}>
        <Pressable onPress={resetImage} style={styles.actionButton}>
          <MaterialIcons name="refresh" size={30} color={theme.colors.white} />
        </Pressable>
        <Pressable onPress={rotateLeft} style={styles.actionButton}>
          <MaterialIcons name="rotate-left" size={30} color={theme.colors.white} />
        </Pressable>
        <Pressable onPress={rotateRight} style={styles.actionButton}>
          <MaterialIcons name="rotate-right" size={30} color={theme.colors.white} />
        </Pressable>
        <Pressable onPress={crop} style={styles.actionButton}>
          <Ionicons name="crop" size={30} color={theme.colors.white} />
        </Pressable>
        <Pressable onPress={handleSaveEditedImage}style={styles.actionButton}>
          <Ionicons name="checkmark" size={30} color={theme.colors.blue} />
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} style={styles.actionButton}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ImageEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.blackgray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp(75),
    height: hp(50),
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: theme.colors.defaultblack,
  },
  actionButton: {
    padding: 10,
  },
  cancelButton: {
    color: theme.colors.blue,
    fontSize: 16,
    fontWeight: theme.fontWeights.medium,
  },
  errorText: {
    color: theme.colors.white,
    fontSize: 18,
    marginBottom: 20,
  },
});
