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
import { Terminal} from "./Terminal";
import { Optional } from "./Optional";
import {ctx, Nil} from "./global";
import {StreamInput, TsStream} from "./TsStream";
import IPipeline from "./IPipline";


export class Pipeline<T> implements IPipeline<T>{
    private lastOp: PipelineOp;
    private terminal: Terminal<T>;
    private consumed:boolean = false;

    constructor(input:StreamInput<T>,separator?:string) {
        // default op iterates over input elements

        if (isFunction(input)) {
            this.lastOp = new GeneratorOp(function () {
                return (input as TsStream.Supplier<T>).call(ctx);
            });
        } else if (isString(input)) {
            let inStr = input as string;
            separator = separator || '';
            if (inStr.endsWith(separator)) {
                inStr = inStr.substring(0, input.length - separator.length);
            }
            this.lastOp = new IteratorOp(inStr.split(separator));
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
    toArray(): T[] {
        return this._checkAndSetConsumed(()=>this.terminal.toArray());
    }
    findFirst(): Optional<T> {
        return this._checkAndSetConsumed(()=>this.terminal.findFirst());
    }
    forEach(consumer: TsStream.Consumer<T>): void {
        return this._checkAndSetConsumed(()=>this.terminal.forEach(consumer));
    }
    min(arg?:TsStream.Comparator<T>|string): Optional<T> {
        return this._checkAndSetConsumed(()=>this.terminal.min(arg));
    }
    max(arg?:TsStream.Comparator<T>|string): Optional<T> {
        return this._checkAndSetConsumed(()=>this.terminal.max(arg));
    }
    sum(path?: string): number {
        return this._checkAndSetConsumed(()=>this.terminal.sum(path));
    }
    average(path?: string): Optional<number> {
        return this._checkAndSetConsumed(()=>this.terminal.average(path));
    }
    count(): number {
        return this._checkAndSetConsumed(()=>this.terminal.count());
    }
    allMatch(arg:TsStream.Predicate<T>|RegExp|TsStream.Sample):boolean {
        return this._checkAndSetConsumed( ()=>this.terminal.allMatch(arg));
    }
    anyMatch(arg:TsStream.Predicate<T>|RegExp|TsStream.Sample):boolean {
        return this._checkAndSetConsumed(()=>this.terminal.anyMatch(arg));
    }
    noneMatch(arg:TsStream.Predicate<T>|RegExp|TsStream.Sample):boolean {
        return this._checkAndSetConsumed(()=>this.terminal.noneMatch(arg));
    }
    collect(collector: TsStream.Collector<T>): T {
        return this._checkAndSetConsumed(()=>this.terminal.collect(collector));
    }
    reduce(identity: T|TsStream.Accumulator<T>, accumulator?: TsStream.Accumulator<T>): Optional<T> {
        return this._checkAndSetConsumed(()=>this.terminal.reduce(identity,accumulator));
    }
    groupBy(arg: string|TsStream.Function<T, string>): TsStream.GroupingResult<T> {
        return this._checkAndSetConsumed(()=>this.terminal.groupBy(arg));
    }
    toMap(pathOrKeyMapper: TsStream.Function<T, string>|string,
          mergeFunction: TsStream.Accumulator<T>|boolean = false): TsStream.Map<T>  {
        return this._checkAndSetConsumed(()=>this.terminal.toMap(pathOrKeyMapper, mergeFunction));
    }
    partitionBy(arg0:TsStream.Predicate<T>|number|RegExp|TsStream.Sample): T[][] {
        return this._checkAndSetConsumed(()=>this.terminal.partitionBy(arg0));

    }
    joining(arg?:TsStream.JoinOptions|string): string {
        return this._checkAndSetConsumed(()=>this.terminal.joining(arg));
    }
    iterator() {
        return this._checkAndSetConsumed(()=>this.terminal.iterator());
    }

    add(op:PipelineOp) {
        if (this.lastOp !== null) {
            var prev = this.lastOp;
            op.prev = prev;
            prev.next = op;
        }
        this.lastOp = op;
    };

    next() : T|Nil {
        return this.lastOp.advance();
    };


    //
    // intermediate operations (stateless)
    //

    filter(arg:TsStream.Predicate<T>|RegExp|TsStream.Sample): IPipeline<T> {
        if (isRegExp(arg)) {
            this.add(new FilterOp(function (obj:string) {
                return (arg as RegExp).test(obj);
            }));
        } else if (isObject(arg)) {
            this.add(new FilterOp(function (obj:any) {
                return deepEquals(arg, obj);
            }));
        } else {
            this.add(new FilterOp(arg as Function));
        }
        return this;
    };

    map<U> (mapper: TsStream.Function<T, U>|string): IPipeline<U> {
        if (isString(mapper)) {
            this.add(new MapOp(pathMapper(mapper as string)));
        } else {
            this.add(new MapOp(mapper as TsStream.Function<T, U>));
        }
        return this as unknown as IPipeline<U>;
    };

    flatMap<U> (arg: TsStream.Function<T, U[]>|string): IPipeline<U> {
        if (isString(arg)) {
            this.add(new MapOp(pathMapper(arg as string)));
        } else {
            this.add(new MapOp(arg as TsStream.Function<T, U[]>));
        }
        this.add(new FlatOp());
        return this as unknown as IPipeline<U>;
    };


    //
    // intermediate operations (stateful)
    //

    sorted(arg?: string|TsStream.Comparator<T>): IPipeline<T>{
        var comparator:TsStream.Comparator<T>;
        if (isFunction(arg)) {
            comparator = arg as TsStream.Comparator<T>;
        } else if (isString(arg)) {
            comparator = pathComparator(arg as string);
        } else {
            comparator = defaultComparator;
        }
        this.add(new StatefulOp({
            finisher: function (array:Array<any>) {
                array.sort(comparator);
            }
        }));
        return this;
    };

    shuffle() : IPipeline<T>{
        this.add(new StatefulOp({
            merger: function (obj : any, array : Array<any>) {
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

    reverse() : IPipeline<T>{
        this.add(new StatefulOp({
            merger: function (obj:any, array:Array<any>) {
                array.unshift(obj);
            }
        }));
        return this;
    };

    distinct() : IPipeline<T>  {
        this.add(new StatefulOp({
            filter: function (obj:any, i:number, array:Array<any>) {
                return array.indexOf(obj) < 0;
            }
        }));
        return this;
    };

    slice(begin:number, end:number) : IPipeline<T> {
        if (begin > end) {
            throw "slice(): begin must not be greater than end";
        }
        this.add(new SliceOp(begin, end));
        return this;
    };

    skip(num:number) : IPipeline<T> {
        this.add(new SliceOp(num, Number.MAX_VALUE));
        return this;
    };

    limit(num:number)  : IPipeline<T>{
        this.add(new SliceOp(0, num));
        return this;
    };

    peek(consumer: TsStream.Consumer<T>): IPipeline<T> {
        this.add(new PeekOp(consumer));
        return this;
    };

    takeWhile(arg:RegExp|TsStream.Predicate<T>|TsStream.Sample): IPipeline<T> {
        if (isRegExp(arg)) {
            this.add(new TakeWhileOp(function (obj : string) {
                return (arg as RegExp).test(obj);
            }));
        } else if (isObject(arg)) {
            this.add(new TakeWhileOp(function (obj:any) {
                return deepEquals(arg, obj);
            }));
        } else {
            this.add(new TakeWhileOp(arg as TsStream.Predicate<T>));
        }
        return this;
    };

    dropWhile(arg:RegExp|TsStream.Predicate<T>|TsStream.Sample): IPipeline<T> {
        if (isRegExp(arg)) {
            this.add(new DropWhileOp(function (obj : string) {
                return (arg as RegExp).test(obj);
            }));
        } else if (isObject(arg)) {
            this.add(new DropWhileOp(function (obj:any) {
                return deepEquals(arg, obj);
            }));
        } else {
            this.add(new DropWhileOp(arg as TsStream.Predicate<T>));
        }
        return this;
    };


    indexBy(pathOrKeyMapper: TsStream.Function<T, string>|string,
            mergeFunction: TsStream.Accumulator<T>|boolean = false): TsStream.Map<T>{
        return this.toMap(pathOrKeyMapper, mergeFunction)
    }

    partitioningBy(arg0:TsStream.Predicate<T>|number|RegExp|TsStream.Sample): T[][]{
        return this.partitionBy(arg0);}
    groupingBy(arg: string|TsStream.Function<T, string>): TsStream.GroupingResult<T>{return this.groupBy(arg);}
    each(consumer: TsStream.Consumer<T>): void{return this.forEach(consumer);}
    toList(): T[]{return this.toArray();}
    join(arg?:TsStream.JoinOptions|string): string {return this.joining(arg);}
    avg(path?: string): Optional<number> {return this.average(path);}
    sort(arg?: string|TsStream.Comparator<T>): IPipeline<T>{return this.sorted(arg);}
    size(): number{return this.count();}
    findAny(): Optional<T>{return this.findFirst();}
}
