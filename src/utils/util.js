import urls from '../utils/urls';

export default {
    // Share template image cache
    shareImageSrc: null,
    // Get share template image with Ajax (to prevent cross domain error during canvas export)
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
    // Get the transition of contain mode (center the image and fill the container, the image is displayed in full)
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
    // Get the transition of cover mode (center the image and fill the container, the image is completely filled, leaving no space)
    imgCover(cw, ch, iw, ih) {
        const xRate = cw / iw;
        const yRate = ch / ih;
        const setRate = xRate > yRate ? xRate : yRate;
        const imgWidth = iw * setRate;
        const imgHeight = ih * setRate;
        const imgX = (cw - imgWidth) / 2;
        const imgY = (ch - imgHeight) / 2;
        return {imgWidth, imgHeight, imgX, imgY, rate: setRate};
    },
    // Store language information
    setLang(lang) {
        window.localStorage.setItem('user_lang', lang);
    },
    // Load language information
    getLang(defaultLang) {
        let localLang = window.localStorage.getItem('user_lang')
        if (localLang === null) {
            return defaultLang;
        } else {
            return localLang;
        }
    }
}