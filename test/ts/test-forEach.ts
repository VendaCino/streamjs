
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'forEach'() {

    var data = [];

    Stream([1, 2, 3, 4])
        .forEach(function (num) {
            data.push(num);
        });

    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);

}
@test 'forEach empty'() {

    var called = false;

    Stream([])
        .forEach(function () {
            called = true;
        });

    assert.equal(called, false);

}
@test 'forEach console.log'() {

    Stream(["forEach"])
        .forEach(console.log);

    assert.ok(true);    // assert no error

}

}
