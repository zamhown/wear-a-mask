/* eslint-disable no-console */

const getVectorLength = (v1, v2) => {
    const [x1, y1] = v1;
    const [x2, y2] = v2;
    return (x1 * x2 + y1 * y2) / Math.sqrt(x1 * x1 + y1 * y1);
};

const getDocPosition = (element) => {
    let eleCom = element;
    if (typeof element === 'string') eleCom = document.querySelector(eleCom);
    let x = eleCom.offsetLeft;
    let y = eleCom.offsetTop;
    let parent = eleCom.offsetParent;
    while (parent) {
        x += parent.offsetLeft;
        y += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return {
        x,
        y,
    };
};

// 图片边框类
class Border {
    /*
    成员：
    canvas  画布
    rect  Rect对象，边框大小和位置
    points  边框的四个顶点（左上角点、右上角点、右下角点、左下角点）
    cPoints  边框的四个中点（左、上、右、下）
    rPoint  边框的旋转点
    */
    constructor(canvas) {
        this.canvas = canvas;
    }
    refresh(rect) {
        this.rect = rect;
        this.points = this.rect.points;
        // 中点
        this.cPoints = [];
        this.points.reduce((a, b) => {
            this.cPoints.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
            return b;
        }, this.points[3]);
        // 旋转点
        if (rect.height >= 0) {
            this.rPoint = [(this.points[0][0] + this.points[1][0]) / 2,
                this.points[0][1] - 35];
        } else {
            this.rPoint = [(this.points[2][0] + this.points[3][0]) / 2,
                this.points[0][1] + 35];
        }
        this.draw();
    }
    draw() {
        const {
            points,
            center,
            angle,
            width,
            height,
        } = this.rect;
        const { context } = this.canvas;
        const [c_x, c_y] = center;
        context.save();
        context.translate(c_x, c_y);
        context.rotate(angle);
        context.beginPath();
        context.globalAlpha = 0.5;
        context.lineWidth = '3';
        context.strokeStyle = '#FF9999';
        context.rect(points[0][0] - c_x,
            points[0][1] - c_y,
            width,
            height);
        context.moveTo((points[0][0] + points[1][0]) / 2 - c_x,
            points[0][1] - c_y);
        context.lineTo(this.rPoint[0] - c_x, this.rPoint[1] - c_y);
        context.stroke();
        context.closePath();
        context.globalAlpha = 1;

        const pointList = points.concat(this.cPoints);
        pointList.forEach((item) => {
            const [x, y] = item;
            context.fillStyle = '#FF4949';
            context.fillRect(x - 7 - c_x, y - 7 - c_y, 14, 14);
        });
        pointList.push(this.rPoint);
        
        context.beginPath();
        context.strokeStyle = '#FF4949';
        context.fillStyle = '#FF9999';
        context.lineWidth = '5';
        context.arc(this.rPoint[0] - c_x, this.rPoint[1] - c_y, 8, 0, Math.PI*2, true);
        context.stroke();
        context.closePath();
        context.fill();

        context.restore();
    }
    isPointInSkeletion(point) {
        let status = null;
        const [x, y] = point;
        const { angle } = this.rect;
        const r_point = this.rect.rotatePoint(this.rPoint, angle);
        const d_point = this.points.map(item => this.rect.rotatePoint(item, angle));
        const c_point = this.cPoints.map(item => this.rect.rotatePoint(item, angle));
        // 旋转点
        (() => {
            const [c_x, c_y] = r_point;
            if (Math.sqrt(Math.pow(c_x - x, 2) + Math.pow(c_y - y, 2)) < 10) {
                status = 'r_point';
            }
        })();
        d_point.forEach((item, index) => {
            const [c_x, c_y] = item;
            if (Math.sqrt(Math.pow(c_x - x, 2) + Math.pow(c_y - y, 2)) < 10) {
                status = `point_${index + 1}`;
            }
        });
        c_point.forEach((item, index) => {
            const [c_x, c_y] = item;
            if (Math.sqrt(Math.pow(c_x - x, 2) + Math.pow(c_y - y, 2)) < 10) {
                status = `c_point_${index + 1}`;
            }
        });
        return status;
    }
}

// 矩形类
class Rect {
    /*
    成员：
    width  宽
    height  高
    center  中心点
    angle  旋转角度
    points  左上角点、右上角点、右下角点、左下角点
    */
    constructor(width, height, center, angle) {
        this.height = height;
        this.width = width;
        this.center = center;
        this.angle = angle;
        this.getPoints();
    }
    // 通过宽高和中点获取四个点
    getPoints() {
        const h = this.height;
        const w = this.width;
        const [c_x, c_y] = this.center;
        const points = [];
        points[0] = [c_x - w / 2, c_y - h / 2];
        points[1] = [c_x + w / 2, c_y - h / 2];
        points[2] = [c_x + w / 2, c_y + h / 2];
        points[3] = [c_x - w / 2, c_y + h / 2];
        this.points = points;
    }
    // 旋转
    rotate(angle) {
        this.angle = angle * Math.sign(this.height);
    }
    // 平移
    translate(vector) {
        const [_x, _y] = vector;
        const points = this.points.map(item => [item[0] + _x, item[1] + _y]);
        this.points = points;
        this.getCenter();
    }
    // 缩放
    zoom(status, vector) {
        const _x = parseFloat(vector[0]);
        const _y = parseFloat(vector[1]);
        const _angle = this.angle;
        // 旋转后的 x 轴相对于 canvas 的位置
        let _x_x = Math.sin((_angle + Math.PI / 2));
        let _y_x = Math.cos((_angle + Math.PI / 2));
        // 如果角度为 0 特殊设置，因为有些 Math.cos 不兼容
        if (_angle === 0) {
            _x_x = 1;
            _y_x = 0;
        }
        // 移动向量 vector 在旋转后 x 轴的距离
        const n_x = getVectorLength([_x_x, _y_x], [_x, -_y]);

        // 旋转后的 y 轴相对于 canvas 的位置
        const _x_y = Math.sin(_angle) * 5;
        const _y_y = Math.cos(_angle) * 5;
        // 移动向量 vector 在旋转后 y 轴的距离
        const n_y = getVectorLength([_x_y, _y_y], [_x, -_y]);

        // 通过正切计算出顶点的角度
        const tan = Math.atan(this.height / this.width);
        // 通过移动顶点来缩放
        const pointZoom = (_angles) => {
            // 获取在第一个顶点上面的移动距离
            const n_tan = getVectorLength([-Math.cos(_angles), Math.sin(_angles)], [_x, -_y]);
            this.width += n_tan * Math.cos(tan);
            this.height += n_tan * Math.sin(tan);
            this.center = [
                this.center[0] - n_tan * Math.cos(_angles) / 2,
                this.center[1] - n_tan * Math.sin(_angles) / 2];
        };
        if (status === 'point_1') { // 第1个顶点
            const _angles = tan + _angle;
            pointZoom(_angles);
        } else if (status === 'point_2') { // 第2个顶点
            const _angles = Math.PI - tan + _angle;
            pointZoom(_angles);
        } else if (status === 'point_3') { // 第3个点
            const _angles = Math.PI + tan + _angle;
            pointZoom(_angles);
        } else if (status === 'point_4') { // 第4个点
            const _angles = 2 * Math.PI - tan + _angle;
            pointZoom(_angles);
        } else if (status === 'c_point_1') {
            this.width -= n_x;
            this.center = [
                this.center[0] + n_x * Math.cos(_angle) / 2,
                this.center[1] + n_x * Math.sin(_angle) / 2];
        } else if (status === 'c_point_2') {
            this.height += n_y;
            this.center = [
                this.center[0] + n_y * Math.sin(_angle) / 2,
                this.center[1] - n_y * Math.cos(_angle) / 2];
        } else if (status === 'c_point_3') {
            this.width += n_x;
            this.center = [
                this.center[0] + n_x * Math.cos(_angle) / 2,
                this.center[1] + n_x * Math.sin(_angle) / 2];
        } else if (status === 'c_point_4') {
            this.height -= n_y;
            this.center = [
                this.center[0] + n_y * Math.sin(_angle) / 2,
                this.center[1] - n_y * Math.cos(_angle) / 2];
        }
        this.getPoints();
        //this.setWH();
    }
    // 确定点是否在矩形内部
    isPointInRect(point) {
        // 旋转后的位置
        const points = this.points.map(item => this.rotatePoint(item, this.angle));
        const p1 = points[0];
        const p2 = points[1];
        const p3 = points[2];
        const p4 = points[3];
        const x = point[0];
        const y = -point[1];
        // 是否在两个平行线内
        const ratio1 = (function () {
            const a = (p1[1] - p2[1]) / (p2[0] - p1[0]);
            const b = -p1[1] - a * p1[0];
            const c = -p3[1] - a * p3[0];
            if (b > c && a * x + b > y && a * x + c < y) return true;
            if (b < c && a * x + b < y && a * x + c > y) return true;
            return false;
        }());
        // 是否在两个平行线内
        const ratio2 = (function () {
            const a = (p2[1] - p3[1]) / (p3[0] - p2[0]);
            const b = -p2[1] - a * p2[0];
            const c = -p4[1] - a * p4[0];
            if (p3[0] - p2[0] === 0) {
                if ((p1[0] < x && x < p2[0]) || (p1[0] > x && x > p2[0])) return true;
            }
            if (b > c && a * x + b > y && a * x + c < y) return true;
            if (b < c && a * x + b < y && a * x + c > y) return true;
            return false;
        }());
        if (ratio1 && ratio2) return true;
        return false;
    }
    // 获取中点
    getCenter() {
        const p1 = this.points[0];
        const p3 = this.points[2];
        const x = p1[0] + p3[0];
        const y = p1[1] + p3[1];
        this.center = [x / 2, y / 2];
    }
    // 某点绕中点旋转角度
    rotatePoint(point, angle) {
        const [x, y] = point;
        const [c_x, c_y] = this.center;
        const _x = (x - c_x) * Math.cos(angle) - (y - c_y) * Math.sin(angle) + c_x;
        const _y = (x - c_x) * Math.sin(angle) + (y - c_y) * Math.cos(angle) + c_y;
        return [_x, _y];
    }
    // 设置宽高
    setWH() {
        this.height = Math.abs(this.points[0][1] - this.points[3][1]);
        this.width = Math.abs(this.points[0][0] - this.points[1][0]);
    }
}

// 图片类
class Photo {
    /*
    成员：
    canvas  容器
    imgInput  图片对象或资源地址
    image  图片对象
    isLoad  是否已载入
    onLoad  载入完成钩子
    id  图片id
    options  Photo对象
    rect  Rect对象，代表图像位置
    canEdit  图片是否可以编辑
    */
    constructor(image, canvas, onload = null, rect = null, canEdit = true) {
        this.canvas = canvas;
        this.imgInput = image;
        this.image = null;
        this.onLoad = onload;
        this.rect = rect;
        this.canEdit = canEdit;
        this.id = new Date().getTime();
        this.isLoad = false;
        if (image instanceof Photo) {
            this.options = image;
            this.imgInput = this.options.imgInput;
            this.id = this.options.id;
        } else if (image instanceof Image) {
            this.image = image;
        }
        this.prepare();
    }
    // 载入图片并初始化
    prepare() {
        if (typeof this.imgInput === 'string') {
            this.image = new Image();
            this.image.onload = () => {
                if (this.isLoad) return;
                this.isLoad = true;
                this.init();
            };
            this.image.src = this.imgInput;
            if (this.image.complete) {
                this.isLoad = true;
                this.init();
            }
        } else if (!this.image) {
            this.image = this.imgInput;
            this.isLoad = true;
            this.init();
        } else {
            this.isLoad = true;
            this.init();
        }
    }
    // 初始化
    init() {
        if (this.onLoad) this.onLoad();
        if (!this.rect) {
            if (this.options) {
                const {
                    width, height, center, angle,
                } = this.options.rect;
                this.rect = new Rect(width,
                    height, [center[0], center[1]], angle);
            } else {
                this.rect = new Rect(this.image.width,
                    this.image.height, [this.canvas.width / 2, this.canvas.height / 2], 0);
            }
        }
    }
    // 绘制
    draw() {
        const { image, canvas, rect } = this;
        const { context } = canvas;
        const points = rect.points;
        const [c_x, c_y] = rect.center;
        context.save();
        context.translate(c_x, c_y);
        context.rotate(rect.angle);
        context.scale(Math.sign(rect.width), Math.sign(rect.height))
        context.drawImage(image, 0, 0, image.width, image.height,
            points[0][0] - c_x,
            points[0][1] - c_y,
            rect.width,
            rect.height);
        context.restore();
    }
}

// 画布类
class StickerCanvas {
    /*
    成员：
    options  设置项
    canvas  画布
    width  画布的宽
    height  画布的高
    target  用来触发事件的元素(与canvas重合)
    beforeLoading  数据载入之前的钩子
    afterLoading  数据载入之后的钩子
    data  绘制的数据
    layers  画布的图层
    context  canvas的上下文
    border  活动图片的边框
    current  当前图层
    loadingLayerCount  正在载入的图层的个数
    */
    constructor(options) {
        this.options = options;
        const {
            canvas,
            height,
            width,
            target,
            beforeLoading,
            afterLoading,
            data = []
        } = this.options;
        this.canvas = null;
        this.height = height;
        this.width = width;
        this.target = target;
        this.beforeLoading = beforeLoading;
        this.afterLoading = afterLoading;
        this.data = data;
        this.layers = [];
        if (typeof canvas === 'string') {
            this.canvas = document.getElementById(canvas);
        } else {
            this.canvas = canvas;
        }
        if (typeof target === 'string') {
            this.target = document.getElementById(target);
        } else {
            this.target = target;
        }
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
        this.loadingLayerCount = 0;
        this.border = new Border(this);
        this.current = null;
        this.init();
        this.initEvent();
    }
    // 初始化
    init() {
        this.clear();
        if (this.beforeLoading) this.beforeLoading(this);

        const add = (image) => {
            this.loadingLayerCount += 1;
            const lyr = new Photo(image, this, () => {
                setTimeout(() => {
                    this.loadingLayerCount -= 1;
                    if (this.loadingLayerCount < 1) {
                        this.draw();
                    }
                }, 100);
            }, image.rect, image.canEdit);
            this.layers.push(lyr);
        };

        // 恢复数据
        this.data.forEach((item) => {
            if (typeof item !== 'function') {
                add(item);
            }
        });
        if (this.afterLoading) this.afterLoading(this);
    }
    // 初始化事件响应
    initEvent() {
        this.target.addEventListener('mousedown', e => {
            let p_x = e.pageX;
            let p_y = e.pageY;
            const position = getDocPosition(this.target);
            const scale = this.width / this.target.offsetWidth;
            const point = [
                (p_x - position.x) * scale,
                (p_y - position.y) * scale,
            ];
            const status = this.selectPhoto(point);
            if (status) {
                const move = (event) => {
                    const m_x = event.pageX;
                    const m_y = event.pageY;
                    const vector = [(m_x - p_x) * scale, (m_y - p_y) * scale];
                    if (status === 1) {
                        this.current.rect.translate(vector);
                    } else if (status === 'r_point') {
                        const e_point = [(m_x - position.x) * scale, (m_y - position.y) * scale];
                        const angle = StickerCanvas.getAngle(
                            this.current.rect.center,
                            this.border.rPoint,
                            e_point,
                        );
                        if (!isNaN(angle)) {
                            this.current.rect.rotate(angle);
                        } else {
                            return;
                        }
                    } else {
                        this.current.rect.zoom(status, vector);
                    }
                    this.draw();
                    p_x = m_x;
                    p_y = m_y;
                };
                this.target.addEventListener('mousemove', move);
                this.target.addEventListener('mouseup', () => {
                    this.target.removeEventListener('mousemove', move);
                });
            }
        });
        this.target.addEventListener('touchstart', e => {
            e.preventDefault();
            let p_x = e.touches[0].pageX;
            let p_y = e.touches[0].pageY;
            const position = getDocPosition(this.target);
            const scale = this.width / this.target.offsetWidth;
            const point = [
                (p_x - position.x) * scale,
                (p_y - position.y) * scale,
            ];
            const status = this.selectPhoto(point);
            if (status) {
                const move = (event) => {
                    const m_x = event.touches[0].pageX;
                    const m_y = event.touches[0].pageY;
                    const vector = [(m_x - p_x) * scale, (m_y - p_y) * scale];
                    if (status === 1) {
                        this.current.rect.translate(vector);
                    } else if (status === 'r_point') {
                        const e_point = [(m_x - position.x) * scale, (m_y - position.y) * scale];
                        const angle = StickerCanvas.getAngle(
                            this.current.rect.center,
                            this.border.rPoint,
                            e_point,
                        );
                        if (!isNaN(angle)) {
                            this.current.rect.rotate(angle);
                        } else {
                            return;
                        }
                    } else {
                        this.current.rect.zoom(status, vector);
                    }
                    this.draw();
                    p_x = m_x;
                    p_y = m_y;
                };
                this.target.addEventListener('touchmove', move);
                this.target.addEventListener('touchend', () => {
                    this.target.removeEventListener('touchmove', move);
                });
            }
        });
    }
    // 旋转角度
    static getAngle(cen, first, second) {
        const f_c_x = first[0] - cen[0];
        const f_c_y = cen[1] - first[1];
        const s_c_x = second[0] - cen[0];
        const s_c_y = cen[1] - second[1];
        const c = Math.sqrt(f_c_x * f_c_x + f_c_y * f_c_y)
            * Math.sqrt(s_c_x * s_c_x + s_c_y * s_c_y);
        if (c === 0) return -1;
        const angle = Math.acos((f_c_x * s_c_x + f_c_y * s_c_y) / c);
        // 第一象限
        if (cen[0] - second[0] < 0 && cen[1] - second[1] < 0) {
            return angle;
        }
        // 第二象限
        if (cen[0] - second[0] < 0 && cen[1] - second[1] > 0) {
            return angle;
        }
        // 第三象限
        if (cen[0] - second[0] > 0 && cen[1] - second[1] < 0) {
            return 2 * Math.PI - angle;
        }
        // 第四象限
        if (cen[0] - second[0] > 0 && cen[1] - second[1] > 0) {
            return 2 * Math.PI - angle;
        }
        return null;
    }
    addCommand(command) {
        this.layers.push(command);
        if (this.loadingLayerCount > 0) {
            setTimeout(() => {
                this.draw();
            }, 100);
            return;
        }
        this.draw();
    }
    // 添加图片
    addPhoto(image, rectOptions = null, canEdit = true) {
        let rect = null;
        if (rectOptions) {
            rect = new Rect(rectOptions.width,
                rectOptions.height,
                [rectOptions.centerX, rectOptions.centerY],
                rectOptions.angle);
        }
        if (typeof image === 'string') {
            this.loadingLayerCount += 1;
            const lyr = new Photo(image, this, () => {
                setTimeout(() => {
                    this.loadingLayerCount -= 1;
                    if (this.loadingLayerCount < 1) {
                        this.draw();
                    }
                }, 100);
            }, rect, canEdit);
            this.layers.push(lyr);
        } else {
            const lyr = new Photo(image, this, null, rect, canEdit);
            this.layers.push(lyr);
            this.draw();
        }
    }

    selectPhoto(point) {
        if (this.current) {
            const status = this.border.isPointInSkeletion(point);
            if (status) {
                return status;
            }
        }
        const layers = [].concat(this.layers)
            .reverse();
        this.current = null;
        let c_index = 0;
        layers.forEach((item, index) => {
            if (typeof item !== 'function' && !this.current && item.rect.isPointInRect(point) && item.canEdit) {
                this.current = item;
                c_index = index + 1;
            }
        });
        if (this.current) {
            this.chooseItem(this.layers.length - c_index);
            return 1;
        } else {
            this.draw();
        }
        return 0;
    }

    chooseItem(index) {
        if (this.layers[index].canEdit) {
            this.current = this.layers[index];
            this.layers.splice(index, 1);
            this.layers.push(this.current);
            this.draw();
        }
    }

    removeItem(index) {
        this.layers.splice(index, 1);
        this.draw();
    }

    // 将当前画布的图像导出为png
    export() {
        const canvas = document.createElement('canvas');

        const bg = this.layers[0];
        canvas.width = bg.image.width;
        canvas.height = bg.image.height;
        const context = canvas.getContext('2d');
        context.drawImage(bg.image, 0, 0, bg.image.width, bg.image.height,
            0, 0, canvas.width, canvas.height);
        const xRate = bg.image.width / bg.rect.width;
        const yRate = bg.image.height / bg.rect.height;
        const xOffset = bg.rect.center[0] - bg.rect.width / 2;
        const yOffset = bg.rect.center[1] - bg.rect.height / 2;
        
        if (this.layers[1]) {
            const fg = this.layers[1];
            const points = fg.rect.points;
            let [c_x, c_y] = fg.rect.center;
            c_x = (c_x - xOffset) * xRate;
            c_y = (c_y - yOffset) * yRate;
            context.save();
            context.translate(c_x, c_y);
            context.rotate(fg.rect.angle);
            context.scale(Math.sign(fg.rect.width), Math.sign(fg.rect.height))
            context.drawImage(fg.image, 0, 0, fg.image.width, fg.image.height,
                (points[0][0] - xOffset) * xRate - c_x,
                (points[0][1] - yOffset) * yRate - c_y,
                fg.rect.width * xRate,
                fg.rect.height * yRate);
            context.restore();
        }
        
        return canvas.toDataURL("image/png");
    }

    // 清理画布
    clear() {
        // Store the current transformation matrix
        this.context.save();
        // Use the identity matrix while clearing the canvas
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.width, this.height);
        // Restore the transform
        this.context.restore();
    }
    save() {
        const data = this.layers.map((item) => {
            const { rect, id, img } = item;
            return { rect, id, img };
        });
       return data;
    }
    draw() {
        this.clear();
        this.layers.forEach(item => {
            if (typeof item === 'function') {
                item.apply(null, this.context, this.canvas);
            } else {
                item.draw();
            }
        });
        if (this.current) {
            this.border.refresh(this.current.rect);
        }
    }
}
export default StickerCanvas;
