
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class AnyMatch {
@test 'anyMatch true'() {

    var result = Stream([1, 2, 3, 4])
        .anyMatch(function (num) {
            return num === 4;
        });
    assert.equal(result, true);

}
@test 'anyMatch false'() {

    var result = Stream([1, 2, 3, 4])
        .anyMatch(function (num) {
            return num === 5;
        });
    assert.equal(result, false);

}
@test 'anyMatch empty'() {

    var result = Stream([])
        .anyMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, false);

}
@test 'anyMatch regexp true'() {

    var result = Stream(["a1", "a2", "a3"])
        .anyMatch(/a.*/);
    assert.equal(result, true);

}
@test 'anyMatch regexp false'() {

    var result = Stream(["b1", "b2", "b3"])
        .anyMatch(/a.*/);
    assert.equal(result, false);

}
@test 'anyMatch regexp empty'() {

    var result = Stream([])
        .anyMatch(/a.*/);
    assert.equal(result, false);

}
@test 'anyMatch sample true'() {

    var result = Stream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .anyMatch({a: 1});
    assert.equal(result, true);

}
@test 'anyMatch sample false'() {

    var result = Stream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .anyMatch({a: 4});
    assert.equal(result, false);

}
@test 'anyMatch sample empty'() {

    var result = Stream([])
        .anyMatch({a: 1});
    assert.equal(result, false);

}

}
