
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'peek'() {

    var poke = [];
    var result = Stream([1, 2, 3, 4])
        .peek(function (num) {
            poke.push(num);
        })
        .toArray();

    assert.equal(result.length, poke.length);
    assert.equal(result[0], poke[0]);
    assert.equal(result[1], poke[1]);
    assert.equal(result[2], poke[2]);
    assert.equal(result[3], poke[3]);

}
@test 'peek empty'() {

    var poke = [];
    var result = Stream([])
        .peek(function (num) {
            poke.push(num);
        })
        .toArray();

    assert.equal(poke.length, 0);
    assert.equal(result.length, 0);

}
@test 'peek console.log'() {

    Stream(["peek"])
        .peek(console.log)
        .toArray();

    assert.ok(true);    // assert no error

}

}
