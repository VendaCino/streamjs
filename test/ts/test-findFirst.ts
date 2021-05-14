
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class FindFirst {
@test 'findFirst'() {

    var result = Stream([1, 2, 3, 4])
        .filter(function (num) {
            return num % 2 === 0;
        })
        .findFirst();

    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 2);

}
@test 'findFirst empty'() {

    var result = Stream([]).findFirst();

    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), false);

}
@test 'findFirst object'() {

    var result = Stream({a: 1, b: 2}).findFirst();

    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 1);

}

}
