import {Optional} from "./Optional";
import IPipeline from "./IPipline";
import {TsStream} from "./TsStream";
import {Pipeline} from "./Pipeline";

export default interface ITerminal<T> {
    groupBy(path: string|TsStream.Function<T, string>): TsStream.GroupingResult<T>;

    max(arg?:TsStream.Comparator<T>|string): Optional<T>;
    min(arg?:TsStream.Comparator<T>|string): Optional<T>;
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
    count(): number;
    findFirst(): Optional<T>;
    forEach(consumer: TsStream.Consumer<T>): void;
}
