/* eslint-disable no-console */
import * as faceapi from 'face-api.js';
import maskHelper from './maskHelper';
import urls from './urls';

const modelUrl = urls.modelBaseUrl;

export default {
  modelsLoaded: false,
  modelsLoading: false,
  onModelsLoaded: null,
  onModelsLoadErr: null,
  loadModels () {
    if (this.modelsLoading || this.modelsLoaded) {
      return;
    }
    let failed = false;
    const onLoadErr = () => { failed = true; };
    
    this.modelsLoading = true;
    // Load the pretrained models (weight, bias)
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl).catch(onLoadErr),
      // faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl).catch(onLoadErr),
      // faceapi.nets.mtcnn.loadFromUri(modelUrl).catch(onLoadErr)

      faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl).catch(onLoadErr),
      // faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelUrl).catch(onLoadErr),
    ]).then(async () => {
      this.modelsLoading = false;
      this.modelsLoaded = !failed;
      if (!failed && this.onModelsLoaded) {
        this.onModelsLoaded();
        this.onModelsLoaded = null;
      } else if (failed && this.onModelsLoadErr) {
        this.onModelsLoadErr();
        this.onModelsLoadErr = null;
      }
    });
  },
  detectPic(img, canvasModel, realImgInfo, callback, onFailed) {
    const process = async () => {
      // Set models and hyper-parameters
      const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 })
      // const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.3})
      // const options = new faceapi.MtcnnOptions()
      let result = await faceapi.detectSingleFace(img, options).withFaceLandmarks()
      console.log(result)
      if (result) {
        let maskInfo = maskHelper.wearAMaskAfterFaceDetection(result, canvasModel, realImgInfo);
        // this.drawFaceLandmarks(canvasModel.canvas, [result], realImgInfo)
        if (callback) {
          callback(maskInfo);
        }
      } else if (onFailed) { onFailed('no result'); }
    }
    const processOnFailed = () => { if (onFailed) { onFailed('no result'); } };

    if (this.modelsLoading) {
      this.onModelsLoaded = process;
      this.onModelsLoadErr = processOnFailed;
    } else if (!this.modelsLoaded) {
      this.onModelsLoaded = process;
      this.onModelsLoadErr = processOnFailed;
      this.loadModels();
    } else {
      process();
    }
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