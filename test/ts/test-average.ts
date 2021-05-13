
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'average'() {

    var result = Stream([1, 2, 3, 4]).average();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 2.5);

}
@test 'average empty'() {

    var result = Stream([]).average();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), false);

}
@test 'average via path'() {

    var result = Stream.of({a: 1}, {a: 2}, {a: 3}, {a: 4})
        .average("a");
    assert.equal(result, "[object Optional]");
    assert.equal(result.get(), 2.5);

}
@test 'average via path (empty)'() {

    var result = Stream
        .empty()
        .average("a");
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), false);

}

}
