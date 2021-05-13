
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'sum'() {

    var result = Stream([1, 2, 3, 4]).sum();
    assert.equal(result, 10);

}
@test 'sum empty'() {

    var result = Stream([]).sum();
    assert.equal(result, 0);

}
@test 'sum via path'() {

    var result = Stream.of({a: 1}, {a: 2}, {a: 3}).sum("a");
    assert.equal(result, 6);

}

}
