
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Count {
@test 'count'() {

    var result = Stream([1, 2, 3, 4]).count();
    assert.equal(result, 4);

}
@test 'count empty'() {

    var result = Stream([]).count();
    assert.equal(result, 0);

}

}
