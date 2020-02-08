<p align="center"><img width="400" src="https://raw.githubusercontent.com/zamhown/wear-a-mask/master/assets/logo-title-en.svg" alt="logo"></p>

# Wear a Mask on Your Avatar
A single-page application that uses only the front-end to perform deep-learning-based facial landmark detection on images and automatically adds breathing mask stickers.   
**Wear a mask on your SNS avatars, just make more people aware of epidemic diseases and public health!**  
Application link: [https://zamhown.github.io/wear-a-mask](https://zamhown.github.io/wear-a-mask)  
Application link (Chinese version): [https://zamhown.gitee.io/wear-a-mask](https://zamhown.gitee.io/wear-a-mask)  
[中文版ReadMe](https://github.com/zamhown/wear-a-mask/blob/master/readme/README-chs.md)  

## Usage
After the user uploads his or her avatar, the page will automatically detect the face in the picture, and identify the key points to match the most suitable mask sticker.  Then the user can change the position, size, rotation angle and flip of the sticker in an editor implemented by canvas, and then export the modified avatar.  The entire process is performed on the front end, and the pictures do not need to be uploaded to the server.  
  
Usage case screenshot (Chinese version)：  
![example](https://raw.githubusercontent.com/zamhown/wear-a-mask/master/assets/example.jpg)  

## Face Detection and Facial Landmark Detection
The project uses [face-api.js](https://github.com/justadudewhohacks/face-api.js), which is based on [TensorFlow.js](https://github.com/tensorflow/tfjs).  
The face detection task uses the SSD MobileNet V1 model (trained with the [WIDERFACE dataset](http://mmlab.ie.cuhk.edu.hk/projects/WIDERFace)), and the facial landmark detection task uses a 68-point CNN-based detection model built by the author of face-api.js (the training dataset contains about 35,000 facial images). The models' weight data comes from face-api.js.  

## Automatic Selection and Positioning of Mask Stickers
The project contains several mask sticker images and data for each mask. Take three key points on each mask sticker (upper left corner, upper right corner, and bottom of chin). After detecting the landmarks on the user's avatar, automatically select the mask sticker that best matches the face shape based on these data, and calculate the corresponding geometric transformation, then put the sticker image in the appropriate position on the avatar.  
![mask example](https://raw.githubusercontent.com/zamhown/wear-a-mask/master/assets/mask-example.jpg)  

## Image Editor With Sticker Editing Function
The image editor for this project is implemented using canvas, based on the npm package [xl_canvas](https://www.npmjs.com/package/xl_canvas). Because the package can not be used directly, it was deeply modified, and a series of functions such as flip, touch support, and export at the original resolution were added and finally integrated into the project.

## Commands
### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
Run `build.bat`. 