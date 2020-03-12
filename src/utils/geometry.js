export default {
    // Solve the midpoint of two points
    getMidPoint(p1, p2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        return [(x1 + x2) / 2, (y1 + y2) / 2];
    },
    // Solve the linear analytical equation with two known points (Ax+By+C=0)
    makeLine(p1, p2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        return [
            y1 - y2,
            x2 - x1,
            (x1 - x2) * y2 + (y2 - y1) * x2
        ];
    },
    // Solve the distance of two points
    pointDistance(p1, p2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    },
    // Given a point and the analytical equation (Ax+By+C=0) for a straight line, solve the distance from the point to the line
    pointLineDistance(p, l) {
        const [x, y] = p;
        const [A, B, C] = l;
        return Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B);
    },
    // Given a point and the analytical equation (Ax+By+C=0) for a straight line, solve the perpendicular line passing through the point
    makePerpendicularLine(l, p) {
        const [A, B] = l;
        const [x, y] = p;
        return [
            -B,
            A,
            B * x - A * y
        ];
    },
    // Solve the intersection of two lines
    getCrossPointOfTwoLines(l1, l2) {
        const [A1, B1, C1] = l1;
        const [A2, B2, C2] = l2;
        const denominator = A1 * B2 - A2 * B1;
        return [(B1 * C2 - B2 * C1) / denominator,
            (A2 * C1 - A1 * C2) / denominator];
    },
    // Given a point and the analytical equation (Ax+By+C=0) for a straight line,
    // solve the intersection point of the line and the perpendicular line passing through the point
    getPerpendicularPoint(l, p) {
        return this.getCrossPointOfTwoLines(l, this.makePerpendicularLine(l, p));
    },
    // Calculate the rotation angle according to the rotation center point and the initial and final coordinates of a point
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
        // First quadrant
        if (vecX < 0 && vecY < 0) {
            return angle;
        }
        // Second quadrant
        if (vecX < 0 && vecY > 0) {
            return angle;
        }
        // Third quadrant
        if (vecX > 0 && vecY < 0) {
            return 2 * Math.PI - angle;
        }
        // Fourth quadrant
        if (vecX > 0 && vecY > 0) {
            return 2 * Math.PI - angle;
        }
        return null;
    }
}