
/**
 * 
 */
class Vector {
    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @returns {Vector}
     */
    constructor(x = 0, y = 0, z = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }
    /** 
     * @returns {String}
     */
    toString() {
        return `Vector(${this.x()},${this.y()},${this.z()}|${this.rotation()})`;
    };
    /**
     * @returns {Number[]}
     */
    values() {
        return Object.values(this);
    };
    /**
     * @param {Vector|Number} offset
     * @returns {Vector}
     */
    offset(offset = 0) {
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
    multiply(offset = 0) {
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
    add(offset = 0) {
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
    reset(value = 0) {
        this._x, this._y, this._z = value;
        return this;
    };
    /**
     * @returns {Boolean}
     */
    moving(){
        return Math.abs(this.x()) + Math.abs(this.y()) + Math.abs(this.z()) > 0;
    }
    /**
     * @param {Vector} point
     * @returns {Boolean}
     */
    collide(point) {
        if (point instanceof Vector) {
            return this.x() === position.x() && this.y() === position.y();
        }
        return false;
    };
    /**
     * @returns {Number}
     */
    x() {
        return parseInt(this._x);
    };
    /**
     * @returns {Number}
     */
    y() {
        return parseInt(this._y);
    };
    /**
     * @returns {Number}
     */
    z() {
        return parseInt(this._z);
    };
    /**
     * @returns {Number}
     */
    rotation() {
        return this.z() % 360;
    };
    /**
     * 
     * @returns {Vector}
     */
    static Zero() {
        return new Vector(0, 0, 0);
    }
    /**
     * @returns {Vector}
     */
    static One(){
        return new Vector(1,1);
    }
    /**
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Vector}
     */
    static  Random( x = 100, y = 0 ){
        return new Vector(
            Math.floor(Math.random() * x),
            Math.floor(Math.random() * (y || x)),
        );
    }
}
/**
 * 
 */
class Point extends Vector {

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x = 0, y = 0, z = 0) {
        super(this, x, y, z);
    }

    /**
     * @returns {String}
     */
    toString() {
        return `Point(${this.x(), this.y(), this.z()})`;
    };
    /**
     * @returns {Number}
     */
    x() {
        return parseInt(this._x);
    };
    /**
     * @returns {Number}
     */
    y() {
        return parseInt(this._y);
    };
    /**
     * @returns {Number}
     */
    z() {
        return parseInt(this._z);
    };

}
/**
 * 
 */
class Area {
    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @returns {Area}
     */
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    };
    /**
     * @returns {String}
     */
    toString() {
        return `Area(${this.top()},${this.left()},${this.bottom()},${this.right()})`;
    };
    /**
     * @returns {Number[]}
     */
    values() {
        return Object.values(this);
    };
    /**
     * @returns {Number}
     */
    x() {
        return this._x;
    };
    /**
     * @returns {Number}
     */
    y() {
        return this._y;
    };
    /**
     * @returns {Number}
     */
    width() {
        return this._width;
    };
    /**
     * @returns {Number}
     */
    height() {
        return this._height;
    };
    /**
     * @returns {Vector}
     */
    position() {
        return new Vector(this.x(), this.y());
    };
    /**
     * @returns {Number}
     */
    left() {
        return this.x();
    };
    /**
     * @returns {Number}
     */
    right() {
        return this.left() + this.width();
    };
    /**
     * @returns {Number}
     */
    top() {
        return this.y();
    };
    /**
     * @returns {Number}
     */
    bottom() {
        return this.top() + this.height();
    };
    /**
     * @param {Area|Vector|Number} offset
     * @returns {Area}
     */
    offset(offset) {
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
    contains(element) {
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
    collide(element = 0) {
        if (element instanceof Area) {
            let left = element.left() >= this.left() && element.left() <= this.right();
            let right = element.right() >= this.left() && element.right() <= this.right();
            let top = element.top() >= this.top() && element.top() <= this.bottom();
            let bottom = element.bottom() >= this.top() && element.bottom() <= this.bottom();
            return (left || right) && (top || bottom);
        }
        return this.contains(element);
    };
    /**
     * @returns {Number}
     */
    size() {
        return this.width() * this.height();
    };
    /**
     * @returns {Vector}
     */
    center() {
        return new Vector(
            this.x() + Math.floor(this.width() / 2),
            this.y() + Math.floor(this.height() / 2));
    };
}
/**
 * 
 */
class Color {

    /**
     * @param {Number} R
     * @param {Number} G
     * @param {Number} B
     * @param {Number} A
     * @returns {Color}
     */
    constructor(R = 255, G = 255, B = 255, A = 255) {

        this._r = R % 256;
        this._g = G % 256;
        this._b = B % 256;
        this._a = A % 256;
    };
    /**
     * @returns {String}
     */
    toString() {
        return `Color(${this.R()},${this.G()},${this.B()},${this.A()})`;
    };
    /**
     * @returns {Number[]}
     */
    values() {
        return Object.values(this);
    };
    /**
     * @returns {Number}
     */
    R() {
        return this._r;
    };
    /**
     * @returns {Number}
     */
    G() {
        return this._g;
    };
    /**
     * @returns {Number}
     */
    B() {
        return this._b;
    };
    /**
     * @returns {Number}
     */
    A() {
        return this._a;
    };
};

/**
 * 
 */
class Component{

    constructor(){
        this._tags = [];
        this._properties = {};
    } 
    /**
     * @returns {String[]}
     */
    tags(){
        return this._tags;
    }
    /**
     * 
     * @param {String} tag 
     * @returns {Boolean}
     */
    has( tag = ''){
        return tag && !this.tags().includes(tag);
    }
    /**
     * @param {String} tag 
     * @returns {Component}
     */
    tag( tag = ''){
        if( tag && !this.has(tag) ){
            this.tags().push(tag);
        }
        return this;
    }
    /**
     * @returns {Object}
     */
    properties(){
        return this._properties;
    }
    /**
     * 
     * @param {String} property 
     * @returns {Boolean}
     */
    can( property = '' ){
        return property && this.properties().hasOwnProperty(property);
    }
    /**
     * 
     * @param {String} property 
     * @param {Number} value 
     * @returns {Component}
     */
    set( property = '' , value = 0 ){
        if( this.can(property) ){
            this.properties()[property] = value;
        }
        return this;
    }
    /**
     * @param {String} property 
     * @returns {Number}
     */
    value( property = '' ){
        return this.can(property) && this.properties()[property] || 0;
    }
    /**
     * @param {String} property 
     * @param {Number} amount 
     */
    add( property = '', amount = 1 ){
        if( this.can(property)){
            this.set(property,this.value(property) + amount );
        }
    }
    /**
     * @param {String} property 
     * @param {Number} amount 
     */
    sub( property = '', amount = 1 ){
        if( this.can(property) ){
            this.set(
                property,
                this.value(property) - amount > 0 ? this.value(property) - amount : 0 );
        }
    }
}


export {Vector,Point,Area,Color,Component};