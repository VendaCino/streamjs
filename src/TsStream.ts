import {Pipeline} from "./Pipeline";
import {ctx} from "./global";
import {Optional} from "./Optional";

export type StreamInput<T> = T[]|TsStream.Supplier<T>|String;

export function Stream<T> (input: StreamInput<T>): Pipeline<T> {
    return new Pipeline(input);
}

Stream.from = function <T> (elems: T[]): Pipeline<T> {
    return Stream(elems);
};

Stream.range = function (startInclusive: number, endExclusive: number): Pipeline<number> {
    return Stream.iterate(startInclusive, function (num:number) {
        return num + 1;
    }).limit(endExclusive - startInclusive);
};

Stream.rangeClosed = function (startInclusive: number, endInclusive: number): Pipeline<number>{
    return Stream.range(startInclusive, endInclusive + 1);
};

Stream.of = function <T>(...elems: T[]): Pipeline<T> {
    let args = Array.prototype.slice.call(elems);
    return Stream(args);
};

Stream.generate = function <T> (supplier: TsStream.Supplier<T>): Pipeline<T>{
    return Stream(supplier);
};

Stream.iterate = function <T>(seed: T, fn: TsStream.Function<T, T>): Pipeline<T>{
    let first = true, current = seed;
    return Stream(function () {
        if (first) {
            first = false;
            return seed;
        }
        current = fn.call(ctx, current);
        return current;
    });
};

Stream.empty = function () {
    return Stream([]);
};

Stream.Optional = Optional;

export declare namespace TsStream {
    export interface Supplier<T> {
        (): T
    }

    export interface Function<T, U> {
        (elem: T): U;
    }

    export interface Map<T> {
        [index: string]: T
    }


    export interface Sample {
        [index: string]: any
    }

    export interface Accumulator<T> {
        (e1: T, e2: T, first?: T): T;
    }

    export interface Collector<T> {
        supplier: Supplier<T>;
        accumulator?: TsStream.Accumulator<T>;
        finisher?: Function<T, T>;
    }

    export interface Comparator<T> {
        (e1: T, e2: T): number
    }

    export interface Consumer<T> {
        (elem: T): void;
    }

    export interface Function<T, U> {
        (elem: T): U;
    }

    export interface GroupingResult<T> {
        [index: string]: T[]
    }

    export interface Iterator<T> {
        next(): T;
        done: boolean;
    }

    export interface JoinOptions {
        prefix: string;
        delimiter: string;
        suffix: string;
    }

    export interface Predicate<T> {
        (elem: T): boolean;
    }

    export interface Supplier<T> {
        (): T
    }

}
