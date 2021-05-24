import {Pipeline} from "./Pipeline";
import {
    deepEquals,
    defaultComparator,
    isConsoleFn,
    isFunction,
    isNumber,
    isObject,
    isRegExp,
    isString,
    pathComparator,
    pathMapper
} from "./Utils";
import {Optional} from "./Optional";
import {Iterator} from "./Iterator";
import {ctx, Nil, nil} from "./global";
import ITerminal from "./ITerminal";
import {TsStream} from "./TsStream";

class StreamIterator extends Iterator<any>{
    private pipeline: Pipeline<any>
    private value: Pipeline<any>

    constructor(pipeline: Pipeline<any>) {
        super();
        this.pipeline = pipeline;
        this.value = pipeline.next();
    }
    next  (): any|Nil {
        let pipeline = this.pipeline;
        if (this.value === nil) {
            return {
                value: undefined,
                done: true
            };
        }
        var nextValue = pipeline.next(),
            done = nextValue === nil,
            result = {
                value: this.value,
                done: done
            };
        this.value = nextValue;
        return result;
    }

    iterator()
    {
        return new StreamIterator(this.pipeline);
    }


}


export class Terminal<T> implements ITerminal<T> {

    private pipeline: Pipeline<T>

    constructor(pipeline: Pipeline<T>) {
        this.pipeline = pipeline;
    }

    toArray(): T[] {
        let current:T|Nil, result: T[] = [];
        while ((current = this.pipeline.next()) !== nil) {
            result.push(current as T);
        }
        return result;
    };

    findFirst(): Optional<T> {
        let obj = this.pipeline.next();
        if (obj === nil) {
            return Optional.empty();
        }
        return Optional.ofNullable(obj as T);
    };

    forEach(fn: TsStream.Consumer<T>): void{
        let pipeline = this.pipeline;
        let current, consoleFn = isConsoleFn(fn);
        while ((current = pipeline.next()) !== nil) {
            fn.call(consoleFn ? console : ctx, current as T);
        }
    };

    min(arg?:TsStream.Comparator<T>|string): Optional<T>{
        let comparator : TsStream.Comparator<T>;
        if (isFunction(arg)) {
            comparator = arg as TsStream.Comparator<T>;
        } else if (isString(arg)) {
            comparator = pathComparator(arg as string);
        } else {
            comparator = defaultComparator;
        }
        let current, result = null;
        let pipeline = this.pipeline;
        while ((current = pipeline.next()) !== nil) {
            if (result === null || comparator.call(ctx, current as T, result as T) < 0) {
                result = current;
            }
        }
        return Optional.ofNullable(result as T);
    };

    max(arg?:TsStream.Comparator<T>|string): Optional<T> {
        let comparator : TsStream.Comparator<T>;
        if (isFunction(arg)) {
            comparator = arg as TsStream.Comparator<T>;
        } else if (isString(arg)) {
            comparator = pathComparator(arg as string);
        } else {
            comparator = defaultComparator;
        }
        var current, result = null;
        let pipeline = this.pipeline;
        while ((current = pipeline.next()) !== nil) {
            if (result === null || comparator.call(ctx, current as T, result as T) > 0) {
                result = current;
            }
        }
        return Optional.ofNullable(result as T);
    };

    sum(path?:string) {
        let pipeline = this.pipeline;
        let fn = path ? pathMapper(path) : function (obj : any) {
            return obj;
        };
        var current, result = 0;
        while ((current = pipeline.next()) !== nil) {
            result += fn.call(ctx, current);
        }
        return result;
    };

    average(path?:string): Optional<number> {
        let pipeline = this.pipeline;
        var fn = path ? pathMapper(path) : function (obj : any) {
            return obj;
        };
        var current, count = 0, sum = 0;
        while ((current = pipeline.next()) !== nil) {
            sum += fn.call(ctx, current);
            count++;
        }
        if (sum === 0 || count === 0) {
            return Optional.empty();
        }
        return Optional.of(sum / count);
    };

    count() {
        let pipeline = this.pipeline;
        let result = 0;
        while (pipeline.next() !== nil) {
            result++;
        }
        return result;
    };

    allMatch(arg:TsStream.Predicate<T>|RegExp|TsStream.Sample):boolean {
        let pipeline = this.pipeline;
        let current, fn:Function ;
        if (isRegExp(arg)) {
            fn = function (obj :string) {
                return (arg as RegExp).test(obj);
            };
        } else if (isObject(arg)) {
            fn = function (obj:any) {
                return deepEquals(arg, obj);
            };
        } else {
            fn = arg as Function;
        }
        while ((current = pipeline.next()) !== nil) {
            let match = fn.call(ctx, current);
            if (!match) {
                return false;
            }
        }
        return true;
    };

    anyMatch(arg:TsStream.Predicate<T>|RegExp|TsStream.Sample):boolean {
        let current,  fn;
        if (isRegExp(arg)) {
            fn = function (obj :string) {
                return (arg as RegExp).test(obj);
            };
        } else if (isObject(arg)) {
            fn = function (obj:any) {
                return deepEquals(arg, obj);
            };
        } else {
            fn = arg as Function;
        }
        let pipeline = this.pipeline;
        while ((current = pipeline.next()) !== nil) {
            var match = fn.call(ctx, current);
            if (match) {
                return true;
            }
        }
        return false;
    };

    noneMatch(arg:TsStream.Predicate<T>|RegExp|TsStream.Sample):boolean {
        let current,  fn;
        if (isRegExp(arg)) {
            fn = function (obj :string) {
                return (arg as RegExp).test(obj);
            };
        } else if (isObject(arg)) {
            fn = function (obj:any) {
                return deepEquals(arg, obj);
            };
        } else {
            fn = arg as Function;
        }
        let pipeline = this.pipeline;
        while ((current = pipeline.next()) !== nil) {
            var match = fn.call(ctx, current);
            if (match) {
                return false;
            }
        }
        return true;
    };

    collect(collector: TsStream.Collector<T>): T{
        let pipeline = this.pipeline;
        let identity = collector.supplier.call(ctx);
        let current, first = true;
        while ((current = pipeline.next()) !== nil) {
            // @ts-ignore
            identity = collector.accumulator.call(ctx, identity, current, first);
            first = false;
        }
        if (collector.finisher) {
            identity = collector.finisher.call(ctx, identity);
        }
        return identity;
    };

    reduce(identity: T|TsStream.Accumulator<T>, accumulator?: TsStream.Accumulator<T>): Optional<T> {
        let pipeline = this.pipeline;

        if (accumulator) {
            return Optional.ofNullable(pipeline.collect({
                supplier: function () {
                    return identity as T;
                },
                accumulator: accumulator
            }));
        }

        var reduceFirst = function (_accumulator: TsStream.Accumulator<T>) {
            var current;

            var identity = pipeline.next();
            if (identity === nil) {
                return Optional.empty();
            }

            while ((current = pipeline.next()) !== nil) {
                identity = _accumulator.call(ctx, identity as T, current as T);
            }

            return Optional.ofNullable(identity);
        };

        // @ts-ignore
        return reduceFirst(identity as TsStream.Accumulator<T>);
    };


    groupBy(path: string|TsStream.Function<T, string>): TsStream.GroupingResult<T> {
        let fn :TsStream.Function<T, string> ;
        if (isString(path)) {
            fn = pathMapper(path as string);
        }else fn = path as TsStream.Function<T, string> ;
        let pipeline = this.pipeline as unknown as Pipeline<TsStream.GroupingResult<T>>;
        return pipeline.collect({
            supplier: function () {
                return {};
            },
            accumulator: function (map: any, obj: any) {
                var key = fn.call(ctx, obj);
                if (!map.hasOwnProperty(key)) {
                    map[key] = [];
                }

                if (map[key] === undefined) {
                    map[key] = [];
                }

                map[key].push(obj);
                return map;
            }
        });
    }
    ;

    toMap(pathOrKeyMapper: TsStream.Function<T, string>|string, mergeFunction: TsStream.Accumulator<T>|boolean = false): TsStream.Map<T> {
        let pipeline = this.pipeline as unknown as Pipeline<TsStream.Map<T>>;
        let keyMapper : TsStream.Function<T, string>;
        if (isString(pathOrKeyMapper)) {
            keyMapper = pathMapper(pathOrKeyMapper as string);
        }else keyMapper = pathOrKeyMapper as TsStream.Function<T, string>;
        return pipeline.collect({
            supplier: function () {
                return {};
            },
            accumulator: function (map : any, obj : any) {
                var key = keyMapper.call(ctx, obj);
                if (map.hasOwnProperty(key)) {
                    if (!mergeFunction) {
                        throw "duplicate mapping found for key: " + key;
                    }
                    if (typeof mergeFunction !== "boolean") {
                        map[key] = mergeFunction.call(ctx, map[key], obj);
                    }
                    return map;
                }

                map[key] = obj;
                return map;
            }
        });
    }
    ;

    partitionBy(arg0:TsStream.Predicate<T>|number|RegExp|TsStream.Sample): T[][] {
        let pipeline = this.pipeline as unknown as Pipeline<T[][]>;


        var partitionByPredicate = function (predicate:Function) {
            return pipeline.collect({
                supplier: function () {
                    return {
                        "true": [], "false": []
                    } as unknown as T[][];
                },
                accumulator: function (map : any, obj : any) {
                    let result = predicate.call(ctx, obj);
                    if (!map.hasOwnProperty(result)) {
                        map[result as any] = [];
                    }
                    map[result as any].push(obj);
                    return map;
                }
            });
        };

        var partitionByNumber = function (num:number) {
            return pipeline.collect({
                supplier: function () {
                    return [];
                },
                accumulator: function (array : Array<any>, obj : any) {
                    if (array.length === 0) {
                        array.push([obj]);
                        return array;
                    }

                    var partition = array[array.length - 1];
                    if (partition.length === num) {
                        array.push([obj]);
                        return array;
                    }

                    partition.push(obj);
                    return array;
                }
            });
        };

        if (isFunction(arg0)) {
            return partitionByPredicate(arg0 as Function);
        }
        if (isNumber(arg0)) {
            return partitionByNumber(arg0 as number);
        }
        if (isRegExp(arg0)) {
            return partitionByPredicate(function (obj:string) {
                return (arg0 as RegExp).test(obj);
            });
        }
        if (isObject(arg0)) {
            return partitionByPredicate(function (obj:any) {
                return deepEquals(arg0, obj);
            });
        }
        throw 'partitionBy requires argument of type function, object, regexp or number';
    }

    joining(arg?:TsStream.JoinOptions|string): string {
        var prefix = "", suffix = "", delimiter = "";
        if (arg) {
            if (isString(arg)) {
                delimiter = arg as string;
            } else {
                let opt = arg as TsStream.JoinOptions;
                prefix = opt.prefix || prefix;
                suffix = opt.suffix || suffix;
                delimiter = opt.delimiter || delimiter;
            }
        }
        let pipeline = this.pipeline as unknown as Pipeline<string>;
        return pipeline.collect({
            supplier: function () {
                return "";
            },
            accumulator: function (str:string, obj:string, first?:string) {
                let delim = first ? '' : delimiter;
                return str + delim + String(obj);
            },
            finisher: function (str:string) {
                return prefix + str + suffix;
            }
        });
    }


    iterator () :TsStream.Iterator<T>{
        return new StreamIterator(this.pipeline);
    };
}
