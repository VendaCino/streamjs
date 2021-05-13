import {Pipeline} from "./Pipeline";
import {ctx} from "./global";
import {Optional} from "./Optional";

export function Stream(input) {
    return new Pipeline(input);
}

Stream.from = function (input) {
    return Stream(input);
};

Stream.range = function (startInclusive, endExclusive) {
    return Stream.iterate(startInclusive, function (num) {
        return num + 1;
    }).limit(endExclusive - startInclusive);
};

Stream.rangeClosed = function (startInclusive, endInclusive) {
    return Stream.range(startInclusive, endInclusive + 1);
};

Stream.of = function (...arg:any) {
    var args = Array.prototype.slice.call(arg);
    return Stream(args);
};

Stream.generate = function (supplier) {
    return Stream(supplier);
};

Stream.iterate = function (seed, fn) {
    var first = true, current = seed;
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
