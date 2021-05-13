
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'collect'() {

    var result = Stream([1, 2, 3, 4]).collect({
        supplier: function () {
            return "Data: ";
        },
        accumulator: function (val, num) {
            return val + num + " ";
        },
        finisher: function (val) {
            return val + "!";
        }
    });

    assert.equal(result, "Data: 1 2 3 4 !");

}
@test 'collect without finisher'() {

    var result = Stream([1, 2, 3, 4]).collect({
        supplier: function () {
            return "Data: ";
        },
        accumulator: function (val, num) {
            return val + num + " ";
        }
    });

    assert.equal(result, "Data: 1 2 3 4 ");

}
@test 'collect empty'() {

    var result = Stream([]).collect({
        supplier: function () {
            return "Data: ";
        },
        accumulator: function (val, num) {
            return val + num + " ";
        },
        finisher: function (val) {
            return val + "!";
        }
    });

    assert.equal(result, "Data: !");

}

}
