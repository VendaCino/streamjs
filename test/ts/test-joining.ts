
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Joining {
@test 'joining'() {

    var result = Stream([1, 2, 3, 4]).joining();
    assert.equal(result, "1234");

}
@test 'joining empty'() {

    var result = Stream([]).joining();
    assert.equal(result, "");

}
@test 'joining with options'() {

    var result = Stream([1, 2, 3, 4])
        .joining({
            prefix: "PREFIX_",
            suffix: "_SUFFIX",
            delimiter: ","
        });
    assert.equal(result, "PREFIX_1,2,3,4_SUFFIX");

}
@test 'joining with delimiter'() {

    var result = Stream([1, 2, 3, 4])
        .joining(',');
    assert.equal(result, "1,2,3,4");

}
@test 'joining empty with options'() {

    var result = Stream([])
        .joining({
            prefix: "PREFIX_",
            suffix: "_SUFFIX",
            delimiter: ","
        });
    assert.equal(result, "PREFIX__SUFFIX");

}

}
