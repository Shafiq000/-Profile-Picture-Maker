// import { Dimensions,Platform } from "react-native";

// const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');



// export const wp = percentage =>{
//     if (Platform.OS === 'web') {
//         const maxWidth = 460; // Set a maximum width for the web
//         const calculatedWidth = Math.min(deviceWidth, maxWidth);
//         return `${(percentage * calculatedWidth) / 100}px`; // Use pixel values for precise control
//     }
//     const width = deviceWidth;
//     return (percentage*width)/100;
// }

// export const hp = percentage =>{
//     if (Platform.OS === 'web') {
//         const maxHeight = 1000; // Set a maximum width for the web
//         const calculatedWidth = Math.min(deviceHeight, maxHeight);
//         return`${(percentage * calculatedWidth) / 100}px`;// Use percentage directly for web
//     }
//     const height = deviceHeight;
//     return (percentage*height)/100;
// }

// export const getColumnCount = () =>{
//     if(deviceWidth >= 1024){
//         //desktop
//         return 4;

//     }else if(deviceWidth >= 768){
//         // tablet
//         return 4;
//     }else{
//         // mobile
//         return 4;
//     }
// }

// export const getImageSize = (height, width) =>{
// if(width>height){
//     // landscape
//     return 250;
// }else if(width<height){
//     // portrait
//     return 300;
// }else{
//     // square
//     return 200;
// }
// }

// export const capitalize = (str) =>{
//     return str.replace(/\b\w/g,  l =>l.toUpperCase())
// }

import { Dimensions, Platform } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const wp = percentage => {
    if (Platform.OS === 'web') {
        const maxWidth = 460; // Set a maximum width for the web
        const calculatedWidth = Math.min(deviceWidth, maxWidth);
        return `${(percentage * calculatedWidth) / 100}px`; // Use pixel values for precise control
    }
    const width = deviceWidth;
    return (percentage * width) / 100;
}

export const hp = percentage => {
    if (Platform.OS === 'web') {
        const maxHeight = 1000; // Set a maximum height for the web
        const calculatedHeight = Math.min(deviceHeight, maxHeight);
        return `${(percentage * calculatedHeight) / 100}px`; // Use pixel values for precise control
    }
    const height = deviceHeight;
    return (percentage * height) / 100;
}

export const getColumnCount = () => {
    if (deviceWidth >= 1024) {
        // Desktop
        return 1;
    } else if (deviceWidth >= 768) {
        // Tablet
        return 3; // Adjusted for better readability
    } else {
        // Mobile
        return 2; // Adjusted for smaller screens
    }
}

export const getImageSize = (height, width) => {
    if (width > height) {
        // Landscape
        return 250;
    } else if (width < height) {
        // Portrait
        return 300;
    } else {
        // Square
        return 200;
    }
}

export const capitalize = (str) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}
