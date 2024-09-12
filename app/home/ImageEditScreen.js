import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, Alert, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cropper from 'react-easy-crop';
import Slider from '@react-native-community/slider';
import * as ImageManipulator from 'expo-image-manipulator';
import Animated, { BounceInUp, FadeInUp } from 'react-native-reanimated';

const ImageEditScreen = () => {
  const router = useRouter();
  const [pickImage, setPickImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1); // Default zoom to 1
  const [rotation, setRotation] = useState(0); // Initialize rotation as a valid number (0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    (async () => {
      const storedData = await AsyncStorage.getItem('imageData');
      if (storedData) {
        const { pickImage } = JSON.parse(storedData);
        setPickImage(pickImage);
      }
    })();
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const originalImageUri = pickImage?.uri;

      if (!originalImageUri) {
        throw new Error("No image selected for cropping");
      }

      // Cropping the image
      const croppedImageUri = await cropImage(originalImageUri);

      if (!croppedImageUri) {
        throw new Error("Cropped image URI is not valid");
      }

      // Save the cropped image URI in state and AsyncStorage
      setPickImage({ uri: croppedImageUri });
      await AsyncStorage.setItem('imageData', JSON.stringify({ pickImage: { uri: croppedImageUri } }));

      // Navigate to HomeScreen, passing the cropped image URI as a parameter
      router.push(`/home?croppedImageUri=${encodeURIComponent(croppedImageUri)}`);

      Alert.alert('Success', 'Image saved successfully');
    } catch (error) {
      console.error("Error cropping the image:", error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const cropImage = async (imageUri) => {
    try {
      if (!imageUri) {
        throw new Error("No image URI provided");
      }

      // Applying cropping, rotation, and zoom using ImageManipulator
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          // Crop the image
          { crop: { originX: 0, originY: 0, width: croppedAreaPixels.width, height: croppedAreaPixels.height } },
          // Apply rotation
          { rotate: rotation },
          // Resize based on zoom (scale the image accordingly)
          { resize: { width: croppedAreaPixels.width * zoom, height: croppedAreaPixels.height * zoom } }
        ],
        { format: ImageManipulator.SaveFormat.PNG }
      );

      return result.uri; // Return the processed image's URI
    } catch (error) {
      console.error("Error cropping the image:", error);
      throw error;
    }
  };

  const handleZoomChange = (newZoom) => {
    if (typeof newZoom === 'number') {
      setZoom(newZoom);
    } else {
      console.error('Invalid zoom value:', newZoom);
    }
  };

  const handleRotationChange = (newRotation) => {
    if (typeof newRotation === 'number' && !isNaN(newRotation)) {
      const validRotation = Math.max(Math.round(newRotation), 0); // Ensure it's rounded and non-negative
      setRotation(validRotation);
    } else {
      console.error('Invalid rotation value:', newRotation);
      setRotation(0); // Fallback to zero if an invalid value is encountered
    }
  };

  const handleCancel = () => {
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {pickImage && (
          <Cropper
            image={pickImage.uri}
            crop={crop}
            zoom={zoom}
            rotation={rotation} // Pass rotation as a number
            aspect={4 / 3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            zoomSpeed={4}
            maxZoom={3}
            zoomWithScroll={true}
            showGrid={true}
          />
        )}
      </View>

      {/* Slider for Rotation */}
      <View style={styles.controlContainer}>
        <Text style={styles.label}>Rotate</Text>
        <Slider
          style={styles.slider}
          value={rotation}
          minimumValue={0}
          maximumValue={360}
          onValueChange={handleRotationChange}
        />
      </View>

      {/* Slider for Zoom */}
      <View style={styles.controlContainer}>
        <Text style={styles.label}>Zoom</Text>
        <Slider
          style={styles.slider}
          value={zoom}
          minimumValue={1}
          maximumValue={3}
          step={0.1}
          onValueChange={handleZoomChange}
        />
      </View>

      <Animated.View   entering={BounceInUp.delay(500).springify()} style={styles.btnStyleContainer}>
        <Pressable onPress={handleCancel} style={[styles.saveBtn, { backgroundColor: 'gold' }]}>
          <Text style={{ fontSize: 20, color: '#000' }}>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleSave} style={styles.saveBtn}>
          <Text style={{ fontSize: 20, color: '#000' }}>Save</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};


export default ImageEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'60',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  imageContainer: {
    width: '50%',
    height: '60%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'gold',
  },
  controlContainer: {
    width: '50%',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    // textAlign: 'center',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  saveBtn: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center'  // Centered horizontally
  },
  btnStyleContainer:{
    flexDirection: 'row',
    justifyContent:'space-evenly',
    marginBottom: 20,
    width: '100%'
  }
});
