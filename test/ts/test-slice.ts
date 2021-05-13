
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'slice'() {

    var result = Stream([1, 2, 3, 4])
        .slice(1, 3)
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 2);
    assert.equal(result[1], 3);

}
@test 'slice empty'() {

    var result = Stream([])
        .slice(1, 2)
        .toArray();

    assert.equal(result.length, 0);

}
@test 'slice high'() {

    var result = Stream([1, 2, 3, 4])
        .skip(10, 20)
        .toArray();

    assert.equal(result.length, 0);

}
@test 'slice wrong args'() {

    assert.throws(function () {
        Stream.of(1, 2).slice(2, 1).toArray();
    });

}

}
