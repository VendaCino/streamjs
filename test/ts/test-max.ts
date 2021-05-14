
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Max {
@test 'max'() {

    var result = Stream([1, 2, 3, 4]).max();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 4);

}
@test 'max empty'() {

    var result = Stream([]).max();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), false);

}
@test 'max (comparator)'() {

    var result = Stream([1, 2, 3, 4])
        .max(function (a, b) {
            if (a === b) return 0;
            if (a > b) return -1;
            return 1;
        });

    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 1);

}
@test 'max (path comparator)'() {

    var result = Stream([{a: 1}, {a: 2}, {a: 3}])
        .max("a");
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get().a, 3);

}

}
