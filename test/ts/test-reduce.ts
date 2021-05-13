
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'reduce'() {

    var result = Stream([1, 2, 3, 4])
        .reduce(1000, function (identity, num) {
            return identity + num;
        });
    assert.equal(result, 1010);

}
@test 'reduce empty'() {

    var result = Stream([])
        .reduce(1000, function (identity, num) {
            return identity + num;
        });
    assert.equal(result, 1000);

}
@test 'reduce first'() {

    var result = Stream([1, 2, 3, 4])
        .reduce(function (identity, num) {
            return identity * num;
        });
    assert.equal(result, "[object Optional]");
    assert.equal(result.get(), 24);

}
@test 'reduce first empty'() {

    var result = Stream([])
        .reduce(function (identity, num) {
            return identity * num;
        })
        .orElse("NOTHING");
    assert.equal(result, "NOTHING");

}

}
