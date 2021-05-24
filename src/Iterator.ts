import {isArrayLike, isIterator, isMap, isObject, isSet} from "./Utils";
import {Nil, nil} from "./global";
import {TsStream} from "./TsStream";

export abstract class Iterator<T> implements TsStream.Iterator<T> {
    abstract next() : T|Nil;
    done: boolean = false;
    static of(data:any) {
        if (data === null || data === undefined) {
            return new EmptyIterator(data);
        }
        if (isArrayLike(data)) {
            return new ArrayIterator(data);
        }
        if (isMap(data) || isSet(data)) {
            return new IteratorIterator(data.values());
        }
        if (isIterator(data)) {
            return new IteratorIterator(data);
        }
        if (isObject(data)) {
            return new ObjectIterator(data);
        }
        return new ValueIterator(data);
    };
}



export class ArrayIterator<T> extends Iterator<T> {
    data: any;
    origin: any;
    fence: any;

    constructor(array: any) {
        super();
        this.data = array || [];
        this.origin = 0;
        this.fence = this.data.length;
    }

    next(): T|Nil {
        if (this.origin >= this.fence) {
            return nil;
        }

        try {
            return this.data[this.origin];
        } finally {
            this.origin++;
        }
    };

}

export class IteratorIterator<T> extends Iterator<T> {
    iterator: any;

    constructor(iterator: any) {
        super();
        this.iterator = iterator;
    }

    next(): T|Nil {
        if (this.iterator) {
            var obj = this.iterator.next();
            if (obj.done) {
                delete this.iterator;
            }
            return obj.value;
        } else {
            return nil;
        }
    };
}


export class ObjectIterator<T> extends Iterator<T> {
    private data: any;
    private keys: string[];
    private origin: number;
    private fence: number;

    constructor(object: any) {
        super();
        this.data = object || {};
        this.keys = Object.keys(object);
        this.origin = 0;
        this.fence = this.keys.length;
    }

    next(): T|Nil {
        if (this.origin >= this.fence) {
            return nil;
        }
        try {
            let key = this.keys[this.origin];
            return this.data[key];
        } finally {
            this.origin++;
        }
    };
}

export class ValueIterator<T> extends Iterator<T> {
    private value: any;

    constructor(value: any) {
        super();
        this.value = value;
        this.done = false;
    }

    next(): T|Nil {
        if (!this.done) {
            this.done = true;
            return this.value;
        }
        return nil;
    };

}

export class EmptyIterator<T> extends Iterator<T> {
    private value: any;

    constructor(value: any) {
        super();
        this.value = value;
        this.done = true;
    }

    next() : T|Nil{
        return nil;
    };
}

