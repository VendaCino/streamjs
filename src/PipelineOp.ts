import {Iterator} from "./Iterator";
import {isConsoleFn, isFunction} from "./Utils";
import {ctx, nil} from "./global";
import {TsStream} from "./TsStream";


export abstract  class PipelineOp {
    next : PipelineOp|null = null;
    prev  : PipelineOp|null = null;

    advance(): any {
        return this.prev!.advance();
    }

    abstract pipe(obj: any) : any;
}

export class IteratorOp extends PipelineOp {
    protected iterator: Iterator<any>;
    constructor(data: any) {
        super();
        this.iterator = Iterator.of(data);
    }

    advance(): any {
        let obj = this.iterator.next();
        if (obj === nil) {
            return obj;
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    }

    pipe(obj: any): any {
    }

}

export class MapOp extends PipelineOp {
    protected fn: Function;
    constructor(fn:Function) {
        super();
        this.fn=fn;
    }

    pipe(obj: any): any {
        let result = this.fn.call(ctx, obj);
        if (this.next === null) {
            return result;
        }
        return this.next.pipe(result);
    };
}

export class FlatOp extends PipelineOp {

    protected iterator: Iterator<any>|null;
    constructor() {
        super();
        this.iterator = null;
    }

    advance() :any {
        if (this.iterator === null) {
            return this.prev!.advance();
        }
        let obj = this.iterator.next();
        if (obj === nil) {
            this.iterator = null;
            return this.prev!.advance();
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    };

    pipe(obj:any) {
        this.iterator = Iterator.of(obj);
        let current = this.iterator.next();
        if (current === nil) {
            return this.prev!.advance();
        }
        if (this.next === null) {
            return current;
        }
        return this.next.pipe(current);
    };
}

export class FilterOp extends PipelineOp {
    protected fn: Function;
    constructor(fn:Function) {
        super();
        this.fn=fn;
    }

    pipe(obj: any) {
        var filtered = this.fn.call(ctx, obj);
        if (!filtered) {
            return this.prev!.advance();
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    };
}

export class GeneratorOp extends PipelineOp {
    protected fn: Function;
    constructor(fn: Function) {
        super();
        this.fn = fn;
    }

    advance() {
        let val = this.fn.call(ctx);
        return this.next!.pipe(val);
    };

    pipe(obj: any) {
    }
}

export class StatefulOp extends PipelineOp {
    private filter: any;
    private finisher: any;
    private merger: any;
    private customMerge: boolean;
    private buffer: Array<any>|null;
    private i: number;

    constructor(options:any) {
        super();
        this.prev = null;
        this.next = null;
        this.filter = options.filter;
        this.finisher = options.finisher;
        this.merger = options.merger;
        this.customMerge = isFunction(this.merger);
        this.buffer = null;
        this.i = 0;
    }

    advance() {
        let obj;
        if (this.buffer === null) {
            this.buffer = [];
            while ((obj = this.prev!.advance()) !== nil) {
                // obj will be added to buffer via this.pipe
                this.i++;
            }
            if (this.finisher) {
                this.finisher.call(ctx, this.buffer);
            }
        }

        if (this.buffer.length === 0) {
            return nil;
        }

        obj = this.buffer.shift();
        if (this.next !== null) {
            return this.next.pipe(obj);
        }

        return obj;
    }

    pipe(obj: any) {
        if (this.filter && this.filter.call(ctx, obj, this.i, this.buffer) === false) {
            return;
        }
        if (!this.customMerge) {
            this.buffer!.push(obj);
        } else {
            this.merger.call({}, obj, this.buffer);
        }
    }
}

export class SliceOp extends PipelineOp {
    private begin: number;
    private end: number;
    private i: number;

    constructor(begin:number,end:number) {
        super();
        this.begin = begin;
        this.end = end;
        this.i = 0;
    }

    pipe(obj: any) {
        if (this.i >= this.end) {
            return nil;
        }
        this.i++;
        if (this.i <= this.begin) {
            return this.prev!.advance();
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    }
}

export class PeekOp extends PipelineOp {
    private consumer: TsStream.Consumer<any>;
    private consoleFn: boolean;


    constructor(consumer: TsStream.Consumer<any>) {
        super();
        this.consumer = consumer;
        this.consoleFn = isConsoleFn(consumer);
    }

    pipe(obj: any) {
        this.consumer.call(this.consoleFn ? console : ctx, obj);
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    }
}

export class TakeWhileOp extends PipelineOp {
    private predicate:TsStream.Predicate<any>;

    constructor(predicate:TsStream.Predicate<any>) {
        super();
        this.predicate = predicate;
    }

    pipe(obj: any) {
        let filtered = this.predicate.call(ctx, obj);
        if (filtered !== true) {
            return nil;
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    }
}

export class DropWhileOp extends PipelineOp {
    private predicate:TsStream.Predicate<any>;
    private border: boolean;

    constructor(predicate:TsStream.Predicate<any>) {
        super();
        this.predicate = predicate;
        this.border = false;
    }

    pipe(obj: any) {
        if (!this.border) {
            var filtered = this.predicate.call(ctx, obj);
            if (filtered === true) {
                return this.prev!.advance();
            }
            this.border = true;
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    }

}
