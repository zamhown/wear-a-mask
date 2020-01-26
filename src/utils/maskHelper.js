/* eslint-disable no-console */
import maskData from "./maskData";
import geometry from "./geometry";
import { Object } from "core-js";

function cvt(p) {
    return [p.x, p.y];
}

export default {
    // 口罩图像缓存
    maskImageSrc: {},
    // 挑选合适的口罩
    findMask(lp, rp, bp, side) {
        // 将口罩放缩，左右两点和脸部左右两点重合，计算底部点的距离
        let minDistance = Number.MAX_VALUE;
        let minData = null;
        maskData.masks.filter(m => (m.side == 0 && side == 0) || m.side * side > 0).forEach(m => {
            const dm12 = geometry.pointDistance(m.leftPoint, m.rightPoint);
            const dm13 = geometry.pointDistance(m.leftPoint, m.bottomPoint);
            const dm03 = geometry.pointLineDistance(m.bottomPoint, geometry.makeLine(m.leftPoint, m.rightPoint));
            const dm01 = Math.sqrt(dm13 * dm13 - dm03 * dm03);
            const rate = dm01 / dm12;
            const [x1, y1] = lp;
            const [x2, y2] = rp;
            // 正常
            if ((m.side == 0 && side == 0) || m.side == side) {
                let [x0, y0] = [x1 + (x2 - x1) * rate, y1 + (y2 - y1) * rate];
                let pline = geometry.makePerpendicularLine(geometry.makeLine(lp, rp), [x0, y0]);
                let d = geometry.pointLineDistance(bp, pline);
                if (minDistance > d) {
                    minDistance = d;
                    minData = Object.assign({
                        overturn: false,
                        transform: this.computeTransform(
                            m.leftPoint, m.rightPoint, m.bottomPoint,
                            lp, rp, geometry.getPerpendicularPoint(pline, bp),
                            m.width, m.height)
                    }, m);
                }
            }
            // 翻转
            if ((m.side == 0 && side == 0) || m.side != side) {
                let [x0, y0] = [x2 + (x1 - x2) * rate, y2 + (y1 - y2) * rate];
                let pline = geometry.makePerpendicularLine(geometry.makeLine(lp, rp), [x0, y0]);
                let d = geometry.pointLineDistance(bp, pline);
                if (minDistance > d) {
                    minDistance = d;
                    minData = Object.assign({
                        overturn: true,
                        transform: this.computeTransform(
                            [m.width - m.leftPoint[0], m.leftPoint[1]], [m.width - m.rightPoint[0], m.rightPoint[1]], [m.width - m.bottomPoint[0], m.bottomPoint[1]],
                            lp, rp, geometry.getPerpendicularPoint(pline, bp),
                            m.width, m.height)
                    }, m);
                }
            }
        });
        return minData;
    },
    // 通过三点的起始坐标和终止坐标，计算平移、缩放和旋转（前提：sp1和sp2同高）
    computeTransform(sp1, sp2, sp3, ep1, ep2, ep3, stickerWidth, stickerHeight) {
        const de12 = geometry.pointDistance(ep1, ep2);
        const xScale = de12 / geometry.pointDistance(sp1, sp2);
        const yScale = geometry.pointLineDistance(ep3, geometry.makeLine(ep1, ep2)) / geometry.pointLineDistance(sp3, geometry.makeLine(sp1, sp2));
        return {
            xScale: xScale,
            yScale: yScale,
            centerX: (stickerWidth / 2 - sp1[0]) * xScale + ep1[0],
            centerY: (stickerHeight / 2 - sp1[1]) * xScale + ep1[1],
            angle: geometry.getAngle(ep1,
                [ep1[0] + de12 * Math.sign(ep2[0] - ep1[0]), ep1[1]],
                ep2)
        }
    },
    // 戴口罩
    wearAMaskAfterFaceDetection(result, canvasModel, realImgInfo) {
        const points = result.landmarks.positions;
        let leftPoint = geometry.getMidPoint(cvt(points[1]), cvt(points[2]));  // 左边缘
        let rightPoint = geometry.getMidPoint(cvt(points[15]), cvt(points[14]));  // 右边缘
        const bottomPoint = cvt(points[8]);  // 下边缘
        const nosePoint = cvt(points[28]);  // 鼻
        let side = 0;
        // 判断鼻是否超过左右点
        if (nosePoint.x > rightPoint.x) {
            rightPoint = nosePoint;
            side = 2;
        } else if (nosePoint.x < leftPoint.x) {
            leftPoint = nosePoint;
            side = 1;
        }
        // 查找口罩
        const maskInfo = {
            mask: this.findMask(leftPoint, rightPoint, bottomPoint, side),
            imgOriginalWidth: result.detection.imageWidth,
            imgOriginalHeight: result.detection.imageHeight
        }
        return this.wearAMaskNormally(maskInfo, canvasModel, realImgInfo);
    },
    // 正常地戴口罩
    wearAMaskNormally(maskInfo, canvasModel, realImgInfo) {
        const mask = maskInfo.mask;
        const xRate = realImgInfo.width / maskInfo.imgOriginalWidth;
        const yRate = realImgInfo.height / maskInfo.imgOriginalHeight;
        const stickerWidth = mask.width * mask.transform.xScale * (mask.overturn ? -1 : 1) * xRate;
        this.getMaskImageSrc(mask, url => {
            if (canvasModel.layers.length > 1) {
                canvasModel.removeItem(1);
            }
            canvasModel.addPhoto(url, {
                width: stickerWidth,
                height: mask.height * mask.transform.yScale * yRate,
                centerX: mask.transform.centerX * xRate + realImgInfo.position[0] - (mask.overturn ? stickerWidth : 0),
                centerY: mask.transform.centerY * yRate + realImgInfo.position[1],
                angle: mask.transform.angle
            }, true);
            canvasModel.chooseItem(1);
        });
        return maskInfo;
    },
    // 笨拙地戴口罩
    wearAMaskAsAFool(canvasModel, realImgInfo) {
        const mask = maskData.masks[2];
        this.getMaskImageSrc(mask, url => {
            if (canvasModel.layers.length > 1) {
                canvasModel.removeItem(1);
            }
            canvasModel.addPhoto(url, {
                width: realImgInfo.width / 4,
                height: realImgInfo.height / 4,
                centerX: canvasModel.width / 2,
                centerY: canvasModel.height / 2,
                angle: 0
            }, true);
            canvasModel.chooseItem(1);
        });
        return { mask };
    },
    // 重新戴口罩
    resumeMask(maskInfo, canvasModel, realImgInfo) {
        if (maskInfo.imgOriginalWidth) {
            this.wearAMaskNormally(maskInfo, canvasModel, realImgInfo);
        } else {
            this.wearAMaskAsAFool(canvasModel, realImgInfo);
        }
    },
    // 更换口罩
    changeMask(newMask, canvasModel) {
        const oldRect = canvasModel.layers[1].rect;
        canvasModel.removeItem(1);
        this.getMaskImageSrc(newMask, url => {
            canvasModel.addPhoto(url, {
                width: oldRect.width,
                height: oldRect.height,
                centerX: oldRect.center[0],
                centerY: oldRect.center[1],
                angle: oldRect.angle
            }, true);
            canvasModel.chooseItem(1);
        });
    },
    // ajax获取口罩图片（防止canvas导出时报跨域的错）
    getMaskImageSrc(mask, callback) {
        if (this.maskImageSrc[mask.name]) {
            callback(this.maskImageSrc[mask.name]);
        } else {
            const self = this;
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                const url = URL.createObjectURL(this.response);
                self.maskImageSrc[mask.name] = url;
                callback(url);
            };
            xhr.open('GET', maskData.baseUrl + mask.name, true);
            xhr.responseType = 'blob';
            xhr.send();
        }
    },
}

