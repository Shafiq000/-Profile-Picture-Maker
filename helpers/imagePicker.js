import ImageCropPicker from 'react-native-image-crop-picker';
import { theme } from '../constants/theme';

export const ChooseCropPhoto = async (image, type = 'any', multiple = false) => {
  try {
    let result;
    if (image) {
      result = await ImageCropPicker.openCropper({
        path: image.uri,
        width: 300,
        height: 400,
        cropping: true,
        avoidEmptySpaceAroundImage: true,
        cropperActiveWidgetColor: "#424242",
        cropperStatusBarColor: theme.colors.blackgray,
        cropperToolbarColor: theme.colors.blackgray,
        cropperToolbarWidgetColor: theme.colors.white,
        freeStyleCropEnabled: true,
        enableRotationGesture: false,
        cropperToolbarTitle: '',
        cropperCircleOverlay: true,
        showCropGuidelines: false,
      });
    } else {
      result = await ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        mediaType: type,
        cropping: !multiple,
        multiple,
      });
    }

    if (!result || result?.didCancel) {
      console.log("Image selection was cancelled.");
      return null;
    }

    // Return the result in the correct format
    return { uri: result.path };
  } catch (err) {
    if (err.message.includes('cancelled image selection')) {
      console.log("User cancelled image selection.");
    } else {
      console.error("Error cropping the image:", err);
    }
    return null;
  }
};
