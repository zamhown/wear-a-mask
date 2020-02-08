<p align="center"><img width="400" src="https://raw.githubusercontent.com/zamhown/wear-a-mask/master/assets/logo-title.png" alt="logo"></p>

# 给你的头像戴上口罩(Wear a Mask)
一个纯前端实现的对图像进行基于深度学习的人脸关键点检测并自动添加口罩贴纸的单页面应用。  
**给你的头像戴上口罩，铭记肺炎疫情，提醒更多人重视公共卫生！**   
  
应用链接：[https://zamhown.github.io/wear-a-mask](https://zamhown.github.io/wear-a-mask)  
国内版链接（推荐）：[https://zamhown.gitee.io/wear-a-mask](https://zamhown.gitee.io/wear-a-mask)

## 使用
用户上传自己的头像后，页面会自动检测图片中的人脸，识别出关键点后匹配最适合的口罩贴纸。然后用户可以在一个canvas实现的编辑器内改变贴纸的位置、大小、旋转角度和翻转，然后将修改后的头像导出。整个过程都在前端完成，图片无需上传到服务器。  
  
使用案例截图：  
![example](https://raw.githubusercontent.com/zamhown/wear-a-mask/master/assets/example.jpg)  

## 人脸检测和人脸关键点检测
本项目使用了基于[TensorFlow.js](https://github.com/tensorflow/tfjs)的[face-api.js](https://github.com/justadudewhohacks/face-api.js)库。  
人脸检测任务使用了SSD MobileNet V1模型（用[WIDERFACE数据集](http://mmlab.ie.cuhk.edu.hk/projects/WIDERFace)进行训练），人脸关键点检测任务使用了face-api.js作者构建的基于CNN的68点检测模型（在约有35,000张面部图像的数据集上进行训练），模型权重数据来源于face-api.js。  

## 口罩贴纸的自动选择与定位
项目中包含了若干口罩贴纸素材和每个口罩的数据。在每个口罩贴纸上取三个关键点（左上角、右上角和下巴底部），检测出用户头像上的关键点以后，根据这些数据计算出与脸型最匹配的口罩贴纸，并反向计算出相应的几何变换，将贴纸放在头像上的合适位置。  
![mask example](https://raw.githubusercontent.com/zamhown/wear-a-mask/master/assets/mask-example.jpg)  

## 拥有贴纸编辑功能的图像编辑器
本项目的图像编辑器采用canvas实现，以npm包[xl_canvas](https://www.npmjs.com/package/xl_canvas)为基础。由于该包不能直接使用，于是进行深度修改，添加了翻转、触摸支持、按原始分辨率导出等一系列功能，集成在项目中。  

## 相关命令
### 环境配置
```
npm install
```

### 项目调试
```
npm run serve
```

### 编译与构建
运行`build.bat`。  