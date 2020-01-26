/* eslint-disable no-console */
import * as faceapi from 'face-api.js';
import maskHelper from './maskHelper';
import urls from './urls';

const modelUrl = urls.modelBaseUrl;

export default {
  detectPic(img, canvasModel, realImgInfo, callback, onFailed) {
    let failed = false;
    const onLoadErr = () => { failed = true; };
    
    // 加载训练好的模型(weight，bias)
    // faceLandmark68Net 识别脸部特征用于mobilenet算法
    // faceLandmark68TinyNet 识别脸部特征用于tiny算法
    // ssdMobilenetv1 google开源AI算法除库包含分类和线性回归
    // tinyFaceDetector 比Google的mobilenet更轻量级，速度更快一点
    // mtcnn  多任务CNN算法
    Promise.all([
      faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl).catch(onLoadErr),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl).catch(onLoadErr),
      //faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelUrl).catch(onLoadErr),
      faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl).catch(onLoadErr),
      //faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl).catch(onLoadErr),
      //faceapi.nets.mtcnn.loadFromUri(modelUrl).catch(onLoadErr)
    ]).then(async () => {
      if (!failed) {
        //设置需要使用什么算法和参数进行扫描识别图片的人脸特征
        const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 })
        //const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.3})
        //const options = new faceapi.MtcnnOptions()
        let result = await faceapi.detectSingleFace(img, options).withFaceLandmarks()
        console.log(result)
        if (result) {
          let maskInfo = maskHelper.wearAMaskAfterFaceDetection(result, canvasModel, realImgInfo);
          // this.drawFaceLandmarks(canvasModel.canvas, [result], realImgInfo)
          if (callback) {
            callback(maskInfo);
          }
        } else if (onFailed) { onFailed('no result'); }
      } else if (onFailed) { onFailed('no result'); }
    });
  },
  drawFaceLandmarks(canvas, result, realImgInfo) {
    let ctx = canvas.getContext("2d");
    result.forEach(e => {
      let xRate = realImgInfo.width / e.detection.imageWidth;
      let yRate = realImgInfo.height / e.detection.imageHeight;
      e.landmarks.positions.forEach((e, i) => {
        let x = e.x * xRate + realImgInfo.position[0];
        let y = e.y * yRate + realImgInfo.position[1];
        ctx.fillStyle="#0000FF";
        ctx.fillRect(x - 2, y - 2, 4, 4);
        ctx.font = "12px bold 宋体";
        ctx.fillText(i, x, y);
      });
    });
  }
}