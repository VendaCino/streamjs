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
import {ctx, nil} from "./global";

class StreamIterator extends Iterator{
    private pipeline: Pipeline
    private value: Pipeline

    constructor(pipeline: Pipeline) {
        super();
        this.pipeline = pipeline;
        this.value = pipeline.next();
    }
    next  () {
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


export interface ITerminal {
    toArray(): any[];

    findFirst(): Optional;

    forEach(fn): void;

    min(arg): Optional;

    max(arg): Optional;

    sum(path): number;

    average(path): Optional;

    count(): number;

    allMatch(arg:any): boolean;

    anyMatch(arg): boolean;

    noneMatch(arg): boolean;

    collect(collector): any;

    reduce(arg0,arg1): any;

    groupBy(arg): any;

    toMap(): any;

    partitionBy(): any;

    joining(arg): any;

    iterator():StreamIterator;
}

export class Terminal implements ITerminal {

    private pipeline: Pipeline

    constructor(pipeline: Pipeline) {
        this.pipeline = pipeline;
    }

    toArray() {
        var current, result = [];
        while ((current = this.pipeline.next()) !== nil) {
            result.push(current);
        }
        return result;
    };

    findFirst() {
        var obj = this.pipeline.next();
        if (obj === nil) {
            return Optional.empty();
        }
        return Optional.ofNullable(obj);
    };

    forEach(fn) {
        let pipeline = this.pipeline;
        var current, consoleFn = isConsoleFn(fn);
        while ((current = pipeline.next()) !== nil) {
            fn.call(consoleFn ? console : ctx, current);
        }
    };

    min(arg) {
        var comparator;
        if (isFunction(arg)) {
            comparator = arg;
        } else if (isString(arg)) {
            comparator = pathComparator(arg);
        } else {
            comparator = defaultComparator;
        }
        var current, result = null;
        let pipeline = this.pipeline;
        while ((current = pipeline.next()) !== nil) {
            if (result === null || comparator.call(ctx, current, result) < 0) {
                result = current;
            }
        }
        return Optional.ofNullable(result);
    };

    max(arg) {
        var comparator;
        if (isFunction(arg)) {
            comparator = arg;
        } else if (isString(arg)) {
            comparator = pathComparator(arg);
        } else {
            comparator = defaultComparator;
        }
        var current, result = null;
        let pipeline = this.pipeline;
        while ((current = pipeline.next()) !== nil) {
            if (result === null || comparator.call(ctx, current, result) > 0) {
                result = current;
            }
        }
        return Optional.ofNullable(result);
    };

    sum(path) {
        let pipeline = this.pipeline;
        var fn = path ? pathMapper(path) : function (obj) {
            return obj;
        };
        var current, result = 0;
        while ((current = pipeline.next()) !== nil) {
            result += fn.call(ctx, current);
        }
        return result;
    };

    average(path) {
        let pipeline = this.pipeline;
        var fn = path ? pathMapper(path) : function (obj) {
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
        var result = 0;
        while (pipeline.next() !== nil) {
            result++;
        }
        return result;
    };

    allMatch(arg) {
        let pipeline = this.pipeline;
        var current, fn = arg;
        if (isRegExp(arg)) {
            fn = function (obj) {
                return arg.test(obj);
            };
        } else if (isObject(arg)) {
            fn = function (obj) {
                return deepEquals(arg, obj);
            };
        }
        while ((current = pipeline.next()) !== nil) {
            var match = fn.call(ctx, current);
            if (!match) {
                return false;
            }
        }
        return true;
    };

    anyMatch(arg) {
        var current,  fn = arg;
        if (isRegExp(arg)) {
            fn = function (obj) {
                return arg.test(obj);
            };
        } else if (isObject(arg)) {
            fn = function (obj) {
                return deepEquals(arg, obj);
            };
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

    noneMatch(arg) {
        var current, fn = arg;
        if (isRegExp(arg)) {
            fn = function (obj) {
                return arg.test(obj);
            };
        } else if (isObject(arg)) {
            fn = function (obj) {
                return deepEquals(arg, obj);
            };
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

    collect(collector) {
        let pipeline = this.pipeline;
        var identity = collector.supplier.call(ctx);
        var current, first = true;
        while ((current = pipeline.next()) !== nil) {
            identity = collector.accumulator.call(ctx, identity, current, first);
            first = false;
        }
        if (collector.finisher) {
            identity = collector.finisher.call(ctx, identity);
        }
        return identity;
    };

    reduce(arg0,arg1) {
        let pipeline = this.pipeline;

        if (arg1) {
            return pipeline.collect({
                supplier: function () {
                    return arg0;
                },
                accumulator: arg1
            });
        }

        var reduceFirst = function (accumulator) {
            var current;

            var identity = pipeline.next();
            if (identity === nil) {
                return Optional.empty();
            }

            while ((current = pipeline.next()) !== nil) {
                identity = accumulator.call(ctx, identity, current);
            }

            return Optional.ofNullable(identity);
        };

        return reduceFirst(arg0);
    };


    groupBy(arg) {
        if (isString(arg)) {
            arg = pathMapper(arg);
        }
        let pipeline = this.pipeline;
        return pipeline.collect({
            supplier: function () {
                return {};
            },
            accumulator: function (map, obj) {
                var key = arg.call(ctx, obj);
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

    toMap() {
        let pipeline = this.pipeline;
        var arg0 = arguments[0];
        if (isString(arg0)) {
            arg0 = pathMapper(arg0);
        }
        var arg1: boolean | Function = false;
        if (arguments.length > 1) {
            arg1 = arguments[1];
        }
        return pipeline.collect({
            supplier: function () {
                return {};
            },
            accumulator: function (map, obj) {
                var key = arg0.call(ctx, obj);
                if (map.hasOwnProperty(key)) {
                    if (!arg1) {
                        throw "duplicate mapping found for key: " + key;
                    }
                    if (typeof arg1 !== "boolean") {
                        map[key] = arg1.call(ctx, map[key], obj);
                    }
                    return map;
                }

                map[key] = obj;
                return map;
            }
        });
    }
    ;

    partitionBy() {
        let pipeline = this.pipeline;


        var partitionByPredicate = function (predicate) {
            return pipeline.collect({
                supplier: function () {
                    return {
                        "true": [], "false": []
                    };
                },
                accumulator: function (map, obj) {
                    var result = predicate.call(ctx, obj);
                    if (!map.hasOwnProperty(result)) {
                        map[result] = [];
                    }
                    map[result].push(obj);
                    return map;
                }
            });
        };

        var partitionByNumber = function (num) {
            return pipeline.collect({
                supplier: function () {
                    return [];
                },
                accumulator: function (array, obj) {
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

        var arg0 = arguments[0];
        if (isFunction(arg0)) {
            return partitionByPredicate(arg0);
        }
        if (isNumber(arg0)) {
            return partitionByNumber(arg0);
        }
        if (isRegExp(arg0)) {
            return partitionByPredicate(function (obj) {
                return arg0.test(obj);
            });
        }
        if (isObject(arg0)) {
            return partitionByPredicate(function (obj) {
                return deepEquals(arg0, obj);
            });
        }
        throw 'partitionBy requires argument of type function, object, regexp or number';
    }
    ;

    joining(arg) {
        var prefix = "", suffix = "", delimiter = "";
        if (arg) {
            if (isString(arg)) {
                delimiter = arg;
            } else {
                prefix = arg.prefix || prefix;
                suffix = arg.suffix || suffix;
                delimiter = arg.delimiter || delimiter;
            }
        }
        let pipeline = this.pipeline;
        return pipeline.collect({
            supplier: function () {
                return "";
            },
            accumulator: function (str, obj, first) {
                var delim = first ? '' : delimiter;
                return str + delim + String(obj);
            },
            finisher: function (str) {
                return prefix + str + suffix;
            }
        });
    }


    iterator () :StreamIterator {
        return new StreamIterator(this.pipeline);
    };
}
