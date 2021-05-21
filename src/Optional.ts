import {TsStream} from "./TsStream";

var ctx = {};

export class Optional<T> {

    private val: any | undefined | null;


    constructor(val: any) {
        this.val = val;
    }

    static of<T>(val: T): Optional<T> {
        if (val === null || val === undefined) {
            throw "value must be present";
        }
        return new Optional(val);
    };

    static ofNullable<T>(val: T): Optional<T> {
        return new Optional(val);
    };

    static empty<T>(): Optional<T> {
        return new Optional<T>(undefined);
    };

    isPresent(): boolean {
        return this.val !== null && this.val !== undefined;
    };

    get(): T {
        if (!this.isPresent()) {
            throw "optional this.value is not present";
        }
        return this.val;
    };

    ifPresent(consumer: (elem: T) => void): void {
        if (this.isPresent()) {
            consumer.call(this.val, this.val);
        }
    };

    orElse(other: T): T {
        if (this.isPresent()) {
            return this.val;
        }
        return other;
    };

    orElseGet(supplier: TsStream.Supplier<T>): T {

        if (this.isPresent()) {
            return this.val;
        }
        return supplier.call(ctx);
    };

    orElseThrow(error: any): T {
        if (this.isPresent()) {
            return this.val;
        }
        throw error;
    };

    filter(predicate: (elem: T) => boolean): Optional<T> {
        if (this.isPresent()) {
            var filtered = predicate.call(ctx, this.val);
            if (filtered) {
                return this;
            }
            return Optional.empty();
        }
        return this;
    };

    map<U>(mapper: (elem: T) => U): Optional<U> {
        if (this.isPresent()) {
            var mappedVal = mapper.call(ctx, this.val);
            return Optional.ofNullable(mappedVal);
        }
        // @ts-ignore
        return this;
    };

    flatMap<U>(mapper: (elem: T) => Optional<U>): Optional<U> {
        if (this.isPresent()) {
            return mapper.call(ctx, this.val);
        }
        // @ts-ignore
        return this;
    };

    toString() {
        return "[object Optional]";
    };
}


