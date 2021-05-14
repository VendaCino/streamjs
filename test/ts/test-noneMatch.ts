
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class NoneMatch {
@test 'noneMatch true'() {

    var result = Stream([1, 2, 3, 4])
        .noneMatch(function (num) {
            return num < 0;
        });
    assert.equal(result, true);

}
@test 'noneMatch false'() {

    var result = Stream([1, 2, 3, 4])
        .noneMatch(function (num) {
            return num > 3;
        });
    assert.equal(result, false);

}
@test 'noneMatch empty'() {

    var result = Stream([])
        .noneMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, true);

}
@test 'noneMatch regexp true'() {

    var result = Stream(["a1", "a2", "a3"])
        .noneMatch(/b.*/);
    assert.equal(result, true);

}
@test 'noneMatch regexp false'() {

    var result = Stream(["b1", "a2", "b3"])
        .noneMatch(/a.*/);
    assert.equal(result, false);

}
@test 'noneMatch regexp empty'() {

    var result = Stream([])
        .noneMatch(/a.*/);
    assert.equal(result, true);

}
@test 'noneMatch sample true'() {

    var result = Stream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .noneMatch({a: 4});
    assert.equal(result, true);

}
@test 'noneMatch sample false'() {

    var result = Stream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .noneMatch({a: 1});
    assert.equal(result, false);

}
@test 'noneMatch sample empty'() {

    var result = Stream([])
        .noneMatch({a: 1});
    assert.equal(result, true);

}

}
