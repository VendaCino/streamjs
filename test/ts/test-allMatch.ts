
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'allMatch true'() {

    var result = Stream([1, 2, 3, 4])
        .allMatch(function (num) {
            return num > 0;
        });
    assert.equal(result, true);

}
@test 'allMatch false'() {

    var result = Stream([1, 2, 3, 4])
        .allMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, false);

}
@test 'allMatch empty'() {

    var result = Stream([])
        .allMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, true);

}
@test 'allMatch regexp true'() {

    var result = Stream(["a1", "a2", "a3"])
        .allMatch(/a.*/);
    assert.equal(result, true);

}
@test 'allMatch regexp false'() {

    var result = Stream(["a1", "a2", "b3"])
        .allMatch(/a.*/);
    assert.equal(result, false);

}
@test 'allMatch regexp empty'() {

    var result = Stream([])
        .allMatch(/a.*/);
    assert.equal(result, true);

}
@test 'allMatch sample true'() {

    var result = Stream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .allMatch({b: 5});
    assert.equal(result, true);

}
@test 'allMatch sample false'() {

    var result = Stream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .allMatch({a: 1});
    assert.equal(result, false);

}
@test 'allMatch sample empty'() {

    var result = Stream([])
        .allMatch({a: 1});
    assert.equal(result, true);

}

}
