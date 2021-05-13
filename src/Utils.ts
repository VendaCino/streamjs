
export function defaultComparator(a, b) {
    if (a === b) {
        return 0;
    }
    return a > b ? 1 : -1;
};

export function pathComparator(path){
    var fn = pathMapper(path);
    return function (obj1, obj2) {
        var a = fn(obj1),
            b = fn(obj2);
        return defaultComparator(a, b);
    };
};

export function pathMapper(path){
    if (path.indexOf('.') < 0) {
        return function (obj) {
            return obj[path];
        };
    }

    var paths = path.split('.');
    return function (obj) {
        var current = obj;
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            current = current[path];
        }
        return current;
    };
};
 export function deepEquals(a, b):boolean{
    if (!isObject(a)) {
        return a === b;
    }

    if (!isObject(b)) {
        return false;
    }

    for (var prop in a) {
        if (!a.hasOwnProperty(prop)) {
            continue;
        }

        if (!b.hasOwnProperty(prop)) {
            return false;
        }

        var val1 = a[prop];
        var val2 = b[prop];
        var propEquals = deepEquals(val1, val2);

        if (!propEquals) {
            return false;
        }
    }

    return true;
};

var ObjToString = Object.prototype.toString;

export function isString(obj) :boolean{
    return ObjToString.call(obj) === '[object String]';
}

export function isFunction(obj) :boolean{
    return typeof obj === 'function' || false;
}

export function isNumber(obj):boolean {
    return ObjToString.call(obj) === '[object Number]';
}

export function isArrayLike(obj):boolean{
    var length = obj.length;
    return typeof length === 'number' && length >= 0;
};

export function isSet(obj) :boolean{
    // @ts-ignore
    return Boolean(Set) && obj instanceof Set && isFunction(obj.values);
}

export function isMap(obj):boolean {
    // @ts-ignore
    return Boolean(Map) && obj instanceof Map && isFunction(obj.values);
}

export function isIterator(obj):boolean {
    return Boolean(obj) && isFunction(obj.next);
}

export function isObject(obj) :boolean{
    return Boolean(obj) && typeof obj === 'object';
}

export function isRegExp(obj):boolean {
    return ObjToString.call(obj) === '[object RegExp]';
}

export function isConsoleFn(fn) :boolean{
    if (!console) {
        return false;
    }
    return console.log === fn || console.warn === fn || console.error === fn || console.trace === fn;
}
