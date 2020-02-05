import urls from '../utils/urls';

export default {
    // 分享图像缓存
    shareImageSrc: null,
    // ajax获取分享图片（防止canvas导出时报跨域的错）
    getShareImageSrc(filename, callback) {
        if (this.shareImageSrc) {
            callback(this.shareImageSrc);
        } else {
            const self = this;
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                const url = URL.createObjectURL(this.response);
                self.shareImageSrc = url;
                callback(url);
            };
            xhr.open('GET', urls.assetsBaseUrl + filename, true);
            xhr.responseType = 'blob';
            xhr.send();
        }
    },
    // 排版图片，填充容器并居中（图片完整显示，留空白）
    imgContain(cw, ch, iw, ih) {
        const xRate = cw / iw;
        const yRate = ch / ih;
        const setRate = xRate < yRate ? xRate : yRate;
        const imgWidth = iw * setRate;
        const imgHeight = ih * setRate;
        const imgX = (cw - imgWidth) / 2;
        const imgY = (ch - imgHeight) / 2;
        return {imgWidth, imgHeight, imgX, imgY, rate: setRate};
    },
    // 排版图片，填充容器并居中（图片不留空白）
    imgCover(cw, ch, iw, ih) {
        const xRate = cw / iw;
        const yRate = ch / ih;
        const setRate = xRate > yRate ? xRate : yRate;
        const imgWidth = iw * setRate;
        const imgHeight = ih * setRate;
        const imgX = (cw - imgWidth) / 2;
        const imgY = (ch - imgHeight) / 2;
        return {imgWidth, imgHeight, imgX, imgY, rate: setRate};
    }
}