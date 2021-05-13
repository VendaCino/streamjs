
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'min'() {

    var result = Stream([1, 2, 3, 4]).min();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 1);

}
@test 'min empty'() {

    var result = Stream([]).min();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), false);

}
@test 'min (comparator)'() {

    var result = Stream([1, 2, 3, 4])
        .min(function (a, b) {
            if (a === b) return 0;
            if (a > b) return -1;
            return 1;
        });

    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 4);

}
@test 'min (path comparator)'() {

    var result = Stream([{a: 1}, {a: 2}, {a: 3}])
        .min("a");
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get().a, 1);

}

}
