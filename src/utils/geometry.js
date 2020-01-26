export default {
    // 求两点的中点
    getMidPoint(p1, p2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        return [(x1 + x2) / 2, (y1 + y2) / 2];
    },
    // 已知两点求直线解析式Ax+By+C=0
    makeLine(p1, p2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        return [
            y1 - y2,
            x2 - x1,
            (x1 - x2) * y2 + (y2 - y1) * x2
        ];
    },
    // 两点距离
    pointDistance(p1, p2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    },
    // 已知一点和直线解析式Ax+By+C=0，求点到直线的距离
    pointLineDistance(p, l) {
        const [x, y] = p;
        const [A, B, C] = l;
        return Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B);
    },
    // 已知直线解析式Ax+By+C=0和垂线上一点，求过该点的垂线的解析式
    makePerpendicularLine(l, p) {
        const [A, B] = l;
        const [x, y] = p;
        return [
            -B,
            A,
            B * x - A * y
        ];
    },
    // 求两直线的交点
    getCrossPointOfTwoLines(l1, l2) {
        const [A1, B1, C1] = l1;
        const [A2, B2, C2] = l2;
        const denominator = A1 * B2 - A2 * B1;
        return [(B1 * C2 - B2 * C1) / denominator,
            (A2 * C1 - A1 * C2) / denominator];
    },
    // 已知一点和直线解析式Ax+By+C=0，求点到直线的垂线与直线的交点
    getPerpendicularPoint(l, p) {
        return this.getCrossPointOfTwoLines(l, this.makePerpendicularLine(l, p));
    },
    // 根据旋转中心点和一点的初、末坐标，求旋转角度
    getAngle(center, sp, ep) {
        const [cx, cy] = center;
        const [sx, sy] = sp;
        const [ex, ey] = ep;
        const f_c_x = sx - cx;
        const f_c_y = cy - sy;
        const s_c_x = ex - cx;
        const s_c_y = cy - ey;
        const c = Math.sqrt(f_c_x * f_c_x + f_c_y * f_c_y)
            * Math.sqrt(s_c_x * s_c_x + s_c_y * s_c_y);
        if (c === 0) return -1;
        const angle = Math.acos((f_c_x * s_c_x + f_c_y * s_c_y) / c);
        const [vecX, vecY] = [cx - ex, cy - ey];
        // 第一象限
        if (vecX < 0 && vecY < 0) {
            return angle;
        }
        // 第二象限
        if (vecX < 0 && vecY > 0) {
            return angle;
        }
        // 第三象限
        if (vecX > 0 && vecY < 0) {
            return 2 * Math.PI - angle;
        }
        // 第四象限
        if (vecX > 0 && vecY > 0) {
            return 2 * Math.PI - angle;
        }
        return null;
    }
}