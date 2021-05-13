import {isArrayLike, isIterator, isMap, isObject, isSet} from "./Utils";
import {nil} from "./global";

export abstract class Iterator {
    abstract next();
    static of(data) {
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



export class ArrayIterator extends Iterator {
    data: any;
    origin: any;
    fence: any;

    constructor(array: any) {
        super();
        this.initialize(array);
    }

    next() {
        if (this.origin >= this.fence) {
            return nil;
        }

        try {
            return this.data[this.origin];
        } finally {
            this.origin++;
        }
    };

    initialize(array: Array<any>) {
        this.data = array || [];
        this.origin = 0;
        this.fence = this.data.length;
    };
}

export class IteratorIterator extends Iterator {
    iterator: any;

    constructor(iterator: any) {
        super();
        this.iterator = iterator;
    }

    next() {
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


export class ObjectIterator extends Iterator {
    private data: any;
    private keys: string[];
    private origin: number;
    private fence: number;

    constructor(object: any) {
        super();
        this.initialize(object);
    }

    initialize(object: any) {
        this.data = object || {};
        this.keys = Object.keys(object);
        this.origin = 0;
        this.fence = this.keys.length;
    };

    next() {
        if (this.origin >= this.fence) {
            return nil;
        }

        try {
            var key = this.keys[this.origin];
            return this.data[key];
        } finally {
            this.origin++;
        }
    };
}

export class ValueIterator extends Iterator {
    private done: Boolean | undefined;
    private value: any;

    constructor(value: any) {
        super();
        this.initialize(value);
    }

    initialize(value: any) {
        this.value = value;
        this.done = false;
    };

    next() {
        if (!this.done) {
            this.done = true;
            return this.value;
        }
        return nil;
    };

}

export class EmptyIterator extends Iterator {
    private value: any;
    private done: boolean | undefined;

    constructor(value: any) {
        super();
        this.initialize(value)
    }

    initialize(value: any) {
        this.value = value;
        this.done = true;
    };

    next() {
        return nil;
    };
}

