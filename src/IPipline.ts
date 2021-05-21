import {Optional} from "./Optional";
import {TsStream} from "./TsStream";
import {Pipeline} from "./Pipeline";
import ITerminal from "./ITerminal";

export default interface IPipeline<T> extends ITerminal<T>{
    reverse(): IPipeline<T>;
    size(): number;
    sorted(): IPipeline<T>;
    sorted(comparator: TsStream.Comparator<T>): IPipeline<T>;
    sorted(path: string): IPipeline<T>;
    sort(): IPipeline<T>;
    sort(comparator: TsStream.Comparator<T>): IPipeline<T>;
    sort(path: string): IPipeline<T>;
    shuffle(): IPipeline<T>;
    skip(n: number): IPipeline<T>;
    slice(begin: number, end: number): IPipeline<T>;

    distinct(): IPipeline<T>;
    dropWhile(predicate: TsStream.Predicate<T>): IPipeline<T>;
    dropWhile(regexp: RegExp): Pipeline<string>;
    dropWhile(sample: TsStream.Sample): IPipeline<T>;
    each(consumer: TsStream.Consumer<T>): void;
    filter(predicate: TsStream.Predicate<T>): IPipeline<T>;
    filter(regexp: RegExp): Pipeline<string>;
    filter(sample: TsStream.Sample): IPipeline<T>;
    findAny(): Optional<T>;
    avg(path?: string): number;
    toList(): T[];
    takeWhile(predicate: TsStream.Predicate<T>): IPipeline<T>;
    takeWhile(regexp: RegExp): IPipeline<string>;
    takeWhile(sample: TsStream.Sample): IPipeline<T>;

    partitioningBy(predicate: TsStream.Predicate<T>): T[][];
    partitioningBy(regexp: RegExp): T[][];
    partitioningBy(size: number): T[][];
    partitioningBy(sample: TsStream.Sample): T[][];
    peek(consumer: TsStream.Consumer<T>): IPipeline<T>;
    join(): string;
    join(delimiter: string): string;
    join(options: TsStream.JoinOptions): string;
    limit(limit: number): IPipeline<T>;
    flatMap <U> (mapper: TsStream.Function<T, U[]>): IPipeline<U>;

    groupingBy(mapper: TsStream.Function<T, string>): TsStream.GroupingResult<T>;
    groupingBy(path: string): TsStream.GroupingResult<T>;
    indexBy(keyMapper: TsStream.Function<T, string>, mergeFunction?: TsStream.Accumulator<T>): TsStream.Map<T>;
    map <U> (mapper: TsStream.Function<T, U>): IPipeline<U>;
}
