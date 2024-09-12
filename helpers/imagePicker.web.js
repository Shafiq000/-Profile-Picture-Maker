import * as ImageManipulator from 'expo-image-manipulator';

export const ChooseCropPhoto = async (image) => {
  try {
    if (image) {
      const manipResult = await ImageManipulator.manipulateAsync(
        image.uri,
        [
          { crop: { originX: 0, originY: 0, width: 230, height: 230 } }, // Adjust crop size as needed
          { rotate: 90 },  // Example of rotating the image
          { flip: ImageManipulator.FlipType.Vertical }, // Example of flipping the image
        ],
        { format: ImageManipulator.SaveFormat.PNG } // Omit the compress option for PNG
      );
      return manipResult;
    }
  } catch (error) {
    console.error('Error during image manipulation:', error);
  }
};
