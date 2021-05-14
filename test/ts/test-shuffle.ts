
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Shuffle {
@test 'shuffle num array'() {

    var data = [1, 2, 3, 4, 5];

    var result = Stream(data)
        .shuffle()
        .toArray();

    assert.equal(result.length, data.length);
    assert.ok(result.indexOf(1) > -1);
    assert.ok(result.indexOf(2) > -1);
    assert.ok(result.indexOf(3) > -1);
    assert.ok(result.indexOf(4) > -1);
    assert.ok(result.indexOf(5) > -1);

    // assert original data is untouched
    assert.equal(data.length, 5);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
    assert.equal(data[4], 5);

}

}
