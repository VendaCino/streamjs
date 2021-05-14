
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Distinct {
@test 'distinct'() {

    var result = Stream([1, 3, 3, 1])
        .distinct()
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);

}
@test 'distinct empty'() {

    var result = Stream([])
        .distinct()
        .toArray();

    assert.equal(result.length, 0);

}

}
