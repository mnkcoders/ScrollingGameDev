
/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {Vector}
 */
function Vector(x = 0, y = 0, z = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
}
/** 
 * @returns {String}
 */
Vector.prototype.toString = function () {
    return `Vector(${this.x()},${this.y()},${this.z()}|${this.rotation()})`;
};
/**
 * @returns {Number[]}
 */
Vector.prototype.values = function(){
    return Object.values(this);
};
/**
 * @param {Vector|Number} offset
 * @returns {Vector}
 */
Vector.prototype.offset = function (offset = 0) {
    if (offset instanceof Vector) {
        return new Vector(offset.x() - this.x(), offset.y() - this.y());
    }
    else if (Number.isInteger(offset)) {
        return new Vector(offset);
    }
    return this;
};
/**
 * @param {Vector|Number} offset
 * @returns {Vector}
 */
Vector.prototype.multiply = function (offset = 0) {
    if (offset instanceof Vector) {
        this._x *= offset.x();
        this._y *= offset.y();
    }
    else if (typeof offset === 'number') {
        this._x, this._y *= parseInt(offset);
    }
    return this;
};
/**
 * @param {Vector|Number} offset
 * @returns {Vector}
 */
Vector.prototype.add = function (offset = 0) {
    if (offset instanceof Vector) {
        this._x += offset.x();
        this._y += offset.y();
    }
    else {
        this._x, this._y += parseInt(offset);
    }
    return this;
};
/**
 * @param {Number} value 
 * @returns {Vector}
 */
Vector.prototype.reset = function (value = 0) {
    this._x, this._y, this._z = value;
    return this;
};
/**
 * @param {Vector} point
 * @returns {Boolean}
 */
Vector.prototype.collide = function (point) {
    if (point instanceof Vector) {
        return this.x() === position.x() && this.y() === position.y();
    }
    return false;
};
/**
 * @returns {Number}
 */
Vector.prototype.x = function () {
    return parseInt(this._x);
};
/**
 * @returns {Number}
 */
Vector.prototype.y = function () {
    return parseInt(this._y);
};
/**
 * @returns {Number}
 */
Vector.prototype.z = function () {
    return parseInt(this._z);
};
/**
 * @returns {Number}
 */
Vector.prototype.rotation = function () {
    return this.z() % 360;
};
/**
 * @returns {Vector}
 */
Vector.Zero = () => new Vector(0, 0, 0);

/**
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 */
function Point( x = 0, y = 0, z = 0){
    Vector.prototype.call(this, x , y , z);
}
Point.prototype = Object.create(Vector.prototype);
Point.prototype.constructor = Point;
/**
 * @returns {String}
 */
Point.prototype.toString = function(){
    return `Point(${this.x(),this.y(),this.z()})`;
};
/**
 * @returns {Number}
 */
Point.prototype.x = function(){
    return parseInt(this._x);
};
/**
 * @returns {Number}
 */
Point.prototype.y = function(){
    return parseInt(this._y);
};
/**
 * @returns {Number}
 */
Point.prototype.z = function(){
    return parseInt(this._z);
};



/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @returns {Area}
 */
function Area(x = 0, y = 0, width = 0, height = 0) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
};
/**
 * @returns {String}
 */
Area.prototype.toString = function () {
    return `Area(${this.top()},${this.left()},${this.bottom()},${this.right()})`;
};
/**
 * @returns {Number[]}
 */
Area.prototype.values = function(){
    return Object.values(this);
};
/**
 * @returns {Number}
 */
Area.prototype.x = function () {
    return this._x;
};
/**
 * @returns {Number}
 */
Area.prototype.y = function () {
    return this._y;
};
/**
 * @returns {Number}
 */
Area.prototype.width = function () {
    return this._width;
};
/**
 * @returns {Number}
 */
Area.prototype.height = function () {
    return this._height;
};
/**
 * @returns {Vector}
 */
Area.prototype.position = function () {
    return new Vector(this.x(), this.y());
};
/**
 * @returns {Number}
 */
Area.prototype.left = function () {
    return this.x();
};
/**
 * @returns {Number}
 */
Area.prototype.right = function () {
    return this.left() + this.width();
};
/**
 * @returns {Number}
 */
Area.prototype.top = function () {
    return this.y();
};
/**
 * @returns {Number}
 */
Area.prototype.bottom = function () {
    return this.top() + this.height();
};
/**
 * @param {Area|Vector|Number} offset
 * @returns {Area}
 */
Area.prototype.offset = function (offset) {
    if (offset instanceof Area) {
        return new Area(
            offset.x() - this.x(),
            offset.y() - this.y(),
            offset.width() - this.width(),
            offset.height() - this.height());
    }
    else if (offset instanceof Vector) {
        return new Area(
            offset.x() - this.x(),
            offset.y() - this.y(),
            this.width(), this.height());
    }
    else if (Number.isInteger(offset)) {
        return new Area(
            this.x() + offset,
            this.y() + offset,
            this.width(),
            this.height());
    }
    return this;
};
/**
 * @param {Area|Vector|Number} element
 * @returns {Boolean}
 */
Area.prototype.contains = function (element) {
    if (element instanceof Vector) {
        return element.x() >= this.left() && element.x() <= this.right() &&
            element.y() >= this.top() && element.y() <= this.bottom();
    }
    else if (element instanceof Area) {
        return element.left() >= this.left() && element.right() <= this.right() &&
            element.top() >= this.top() && element.bottom() <= this.bottom();
    }
    else if (Number.isInteger(element)) {
        return element >= this.left() && element <= this.right() &&
            element >= this.top() && element <= this.bottom();
    }
    return false;
};
/**
 * @param {Area|Vector|Number} element
 * @returns {Boolean}
 */
Area.prototype.collide = function (element = 0) {
    if (element instanceof Area) {
        let left = element.left() >= this.left() && element.left() <= this.right();
        let right = element.right() >= this.left() && element.right() <= this.right();
        let top = element.top() >= this.top() && element.top() <= this.bottom();
        let bottom = element.bottom() >= this.top() && element.bottom() <= this.bottom();
        return  (left || right) && (top ||bottom);
    }
    return this.contains(element);
};
/**
 * @returns {Number}
 */
Area.prototype.size = function () {
    return this.width() * this.height();
};
/**
 * @returns {Vector}
 */
Area.prototype.center = function () {
    return new Vector(
        this.x() + Math.floor(this.width() / 2),
        this.y() + Math.floor(this.height() / 2));
};



/**
 * @param {Number} R
 * @param {Number} G
 * @param {Number} B
 * @param {Number} A
 * @returns {Color}
 */
function Color(R, G, B, A) {

    this._r = R % 256;
    this._g = G % 256;
    this._b = B % 256;
    this._a = parseInt(A || 255) % 256;
};
/**
 * @returns {String}
 */
Color.prototype.toString = function () {
    return `Color(${this.R()},${this.G()},${this.B()},${this.A()})`;
};
/**
 * @returns {Number[]}
 */
Color.prototype.values = function(){
    return Object.values(this);
};
/**
 * @returns {Number}
 */
Color.prototype.R = function () {
    return this._r;
};
/**
 * @returns {Number}
 */
Color.prototype.G = function () {
    return this._g;
};
/**
 * @returns {Number}
 */
Color.prototype.B = function () {
    return this._b;
};
/**
 * @returns {Number}
 */
Color.prototype.A = function () {
    return this._a;
};


