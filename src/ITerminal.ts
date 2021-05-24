import {Optional} from "./Optional";
import {TsStream} from "./TsStream";

export default interface ITerminal<T> {
    groupBy(mapper:TsStream.Function<T, string>): TsStream.GroupingResult<T>;
    groupBy(path: string): TsStream.GroupingResult<T>;

    max(): Optional<T>;
    max(comparator: TsStream.Comparator<T>): Optional<T>;
    max(path: string): Optional<T>;
    min(): Optional<T>;
    min(comparator: TsStream.Comparator<T>): Optional<T>;
    min(path: string): Optional<T>;
    noneMatch(predicate: (elem: T) => boolean): boolean;
    noneMatch(regexp: RegExp): boolean;
    iterator(): TsStream.Iterator<T>;
    joining(): string;
    joining(delimiter: string): string;
    joining(options: TsStream.JoinOptions): string;

    partitionBy(predicate: TsStream.Predicate<T>): T[][];
    partitionBy(sample: TsStream.Sample): T[][];
    partitionBy(regexp: RegExp): T[][];
    partitionBy(size: number): T[][];

    reduce<R>(identity: R, accumulator: TsStream.TransAccumulator<T,R>): Optional<R>;
    reduce(identity: T, accumulator: TsStream.Accumulator<T>): Optional<T>;
    reduce(accumulator: TsStream.Accumulator<T>): Optional<T>;
    sum(path?: string): number;
    toArray(): T[];
    toMap(pathOrKeyMapper: TsStream.Function<T, string>|string, mergeFunction?: TsStream.Accumulator<T>): TsStream.Map<T>;
    anyMatch(predicate: TsStream.Predicate<T>): boolean;
    anyMatch(regexp: RegExp): boolean;
    anyMatch(sample: TsStream.Sample): boolean;
    allMatch(predicate: TsStream.Predicate<T>): boolean;
    allMatch(regexp: RegExp): boolean;
    allMatch(sample: TsStream.Sample): boolean;
    average(path?: string): Optional<number>;
    collect(collector: TsStream.Collector<T>): T ;
    collect<R>(collector: TsStream.TransCollector<T,R>): R ;
    count(): number;
    findFirst(): Optional<T>;
    forEach(consumer: TsStream.Consumer<T>): void;
}
