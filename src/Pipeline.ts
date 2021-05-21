import {
    DropWhileOp,
    FilterOp,
    FlatOp,
    GeneratorOp,
    IteratorOp,
    MapOp,
    PeekOp,
    PipelineOp,
    SliceOp,
    StatefulOp,
    TakeWhileOp
} from "./PipelineOp";
import {
    deepEquals,
    defaultComparator,
    isFunction,
    isObject,
    isRegExp,
    isString,
    pathComparator,
    pathMapper
} from "./Utils";
import {ITerminal, Terminal} from "./Terminal";
import { Optional } from "./Optional";
import {ctx} from "./global";
import {StreamInput, TsStream} from "./TsStream";
import IPipeline from "./IPipline";


export class Pipeline<T> implements IPipeline<T>{
    private lastOp: PipelineOp;
    private terminal: Terminal;
    private consumed:boolean = false;

    constructor(input:StreamInput<T>) {
        // default op iterates over input elements

        if (isFunction(input)) {
            this.lastOp = new GeneratorOp(function () {
                return (input as TsStream.Supplier<T>).call(ctx);
            });
        } else if (isString(input)) {
            this.lastOp = new IteratorOp((input as String).split(''));
        } else {
            this.lastOp = new IteratorOp(input);
        }
        this.terminal = new Terminal(this);
    }

    private _checkAndSetConsumed(fn:Function){
        if(this.consumed) throw "stream has already been operated upon";
        try{
            return fn();
        }finally {
            this.consumed = true;
        }
    }
    toArray(): any[] {
        return this._checkAndSetConsumed(()=>this.terminal.toArray());
    }
    findFirst(): Optional<T> {
        return this._checkAndSetConsumed(()=>this.terminal.findFirst());
    }
    forEach(fn: any): void {
        return this._checkAndSetConsumed(()=>this.terminal.forEach(fn));
    }
    min(arg: any): Optional<T> {
        return this._checkAndSetConsumed(()=>this.terminal.min(arg));
    }
    max(arg: any): Optional<T> {
        return this._checkAndSetConsumed(()=>this.terminal.max(arg));
    }
    sum(path: any): number {
        return this._checkAndSetConsumed(()=>this.terminal.sum(path));
    }
    average(path: any): Optional<T> {
        return this._checkAndSetConsumed(()=>this.terminal.average(path));
    }
    count(): number {
        return this._checkAndSetConsumed(()=>this.terminal.count());
    }
    allMatch(arg:any): boolean {
        return this._checkAndSetConsumed( ()=>this.terminal.allMatch(arg));
    }
    anyMatch(arg): boolean {
        return this._checkAndSetConsumed(()=>this.terminal.anyMatch(arg));
    }
    noneMatch(arg): boolean {
        return this._checkAndSetConsumed(()=>this.terminal.noneMatch(arg));
    }
    collect(collector: any) {
        return this._checkAndSetConsumed(()=>this.terminal.collect(collector));
    }
    reduce(arg0,arg1) {
        return this._checkAndSetConsumed(()=>this.terminal.reduce(arg0,arg1));
    }
    groupBy(arg) {
        return this._checkAndSetConsumed(()=>this.terminal.groupBy(arg));
    }
    toMap(arg0,arg1: boolean | Function = false) {
        return this._checkAndSetConsumed(()=>this.terminal.toMap(arg0, arg1));
    }
    partitionBy(arg0) {
        return this._checkAndSetConsumed(()=>this.terminal.partitionBy(arg0));

    }
    joining(arg: any) {
        return this._checkAndSetConsumed(()=>this.terminal.joining(arg));
    }
    iterator() {
        return this._checkAndSetConsumed(()=>this.terminal.iterator());
    }

    add(op) {
        if (this.lastOp !== null) {
            var prev = this.lastOp;
            op.prev = prev;
            prev.next = op;
        }
        this.lastOp = op;
    };

    next() {
        return this.lastOp.advance();
    };


    //
    // intermediate operations (stateless)
    //

    filter(arg) {
        if (isRegExp(arg)) {
            this.add(new FilterOp(function (obj) {
                return arg.test(obj);
            }));
        } else if (isObject(arg)) {
            this.add(new FilterOp(function (obj) {
                return deepEquals(arg, obj);
            }));
        } else {
            this.add(new FilterOp(arg));
        }
        return this;
    };

    map(arg) {
        if (isString(arg)) {
            this.add(new MapOp(pathMapper(arg)));
        } else {
            this.add(new MapOp(arg));
        }
        return this;
    };

    flatMap(arg) {
        if (isString(arg)) {
            this.add(new MapOp(pathMapper(arg)));
        } else {
            this.add(new MapOp(arg));
        }
        this.add(new FlatOp());
        return this;
    };


    //
    // intermediate operations (stateful)
    //

    sorted(arg) {
        var comparator;
        if (isFunction(arg)) {
            comparator = arg;
        } else if (isString(arg)) {
            comparator = pathComparator(arg);
        } else {
            comparator = defaultComparator;
        }
        this.add(new StatefulOp({
            finisher: function (array) {
                array.sort(comparator);
            }
        }));
        return this;
    };

    shuffle() {
        this.add(new StatefulOp({
            merger: function (obj, array) {
                if (array.length === 0) {
                    array.push(obj);
                } else {
                    var i = Math.floor(Math.random() * array.length);
                    var tmp = array[i];
                    array[i] = obj;
                    array.push(tmp);
                }
            }
        }));
        return this;
    };

    reverse() {
        this.add(new StatefulOp({
            merger: function (obj, array) {
                array.unshift(obj);
            }
        }));
        return this;
    };

    distinct() {
        this.add(new StatefulOp({
            filter: function (obj, i, array) {
                return array.indexOf(obj) < 0;
            }
        }));
        return this;
    };

    slice(begin, end) {
        if (begin > end) {
            throw "slice(): begin must not be greater than end";
        }
        this.add(new SliceOp(begin, end));
        return this;
    };

    skip(num) {
        this.add(new SliceOp(num, Number.MAX_VALUE));
        return this;
    };

    limit(num) {
        this.add(new SliceOp(0, num));
        return this;
    };

    peek(consumer) {
        this.add(new PeekOp(consumer));
        return this;
    };

    takeWhile() {
        var arg = arguments[0];
        if (isRegExp(arg)) {
            this.add(new TakeWhileOp(function (obj) {
                return arg.test(obj);
            }));
        } else if (isObject(arg)) {
            this.add(new TakeWhileOp(function (obj) {
                return deepEquals(arg, obj);
            }));
        } else {
            this.add(new TakeWhileOp(arg));
        }
        return this;
    };

    dropWhile() {
        var arg = arguments[0];
        if (isRegExp(arg)) {
            this.add(new DropWhileOp(function (obj) {
                return arg.test(obj);
            }));
        } else if (isObject(arg)) {
            this.add(new DropWhileOp(function (obj) {
                return deepEquals(arg, obj);
            }));
        } else {
            this.add(new DropWhileOp(arg));
        }
        return this;
    };


    indexBy(arg0,arg1: boolean | Function = false){
        return this.toMap(arg0, arg1)
    }

    partitioningBy(arg0){return this.partitionBy(arg0);}
    groupingBy(arg){return this.groupBy(arg);}
    each(fn: any){return this.forEach(fn);}
    toList(){return this.toArray();}
    join(arg: any){return this.joining(arg);}
    avg(path: any){return this.average(path);}
    sort(arg){return this.sorted(arg);}
    size(){return this.count();}
    findAny(){return this.findFirst();}
}
