
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'groupBy'() {

    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = Stream(data)
        .groupBy(function (obj) {
            return obj["lastName"];
        });

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"].length, 2);
    assert.equal(map["Doe"].length, 1);
    assert.equal(map["Parker"][0], data[0]);
    assert.equal(map["Parker"][1], data[1]);
    assert.equal(map["Doe"][0], data[2]);

}
@test 'groupBy path'() {

    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = Stream(data)
        .groupBy("lastName");

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"].length, 2);
    assert.equal(map["Doe"].length, 1);
    assert.equal(map["Parker"][0], data[0]);
    assert.equal(map["Parker"][1], data[1]);
    assert.equal(map["Doe"][0], data[2]);

}
@test 'groupBy empty'() {

    var map = Stream([])
        .groupBy(function (obj) {
            return obj["lastName"];
        });

    assert.equal(Object.keys(map).length, 0);

}

}
