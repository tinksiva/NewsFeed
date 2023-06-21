import { Dimensions, PixelRatio } from "react-native";
const { width, height } = Dimensions.get("window");

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
const screenSize = Math.sqrt(width * height) / 100;

//The scale function takes in a input size and scales the dimensions of the content according to the size of the device
//For smaller dimension device we scale the size down and for a larger one we scale it up
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

//The scale function takes in a input  fontsize and scales the font size according to the pixel density of the device
const scaleFont = (fontSize) => fontSize / PixelRatio.getFontScale();

export { scale, verticalScale, moderateScale, screenSize, scaleFont };
