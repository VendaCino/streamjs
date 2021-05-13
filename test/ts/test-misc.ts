
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'toArray twice'() {

    assert.throws(function () {
        var stream = Stream([1, 2, 3, 4]);
        stream.toArray();
        stream.toArray();
    });

}
@test 'aliases'() {

    var stream = Stream([]);
    assert.strictEqual(stream.toMap, stream.indexBy);
    assert.strictEqual(stream.partitioningBy, stream.partitionBy);
    assert.strictEqual(stream.groupingBy, stream.groupBy);
    assert.strictEqual(stream.each, stream.forEach);
    assert.strictEqual(stream.toList, stream.toArray);
    assert.strictEqual(stream.sorted, stream.sort);
    assert.strictEqual(stream.count, stream.size);
    assert.strictEqual(stream.avg, stream.average);
    assert.strictEqual(stream.join, stream.joining);
    assert.strictEqual(stream.findAny, stream.findFirst);

}
@test 'toString'() {

    var stream = Stream([]);
    assert.equal(stream.toString(), "[object Stream]");

}
@test 'version'() {

    assert.equal(Stream.VERSION, "1.6.4");

}
@test 'noConflict'() {

    var MyStream = Stream.noConflict();
    assert.equal(window.Stream, undefined);
    assert.ok(MyStream !== undefined);
    window.Stream = MyStream;

}

}
