
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class ToMap {
@test 'toMap'() {

    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = Stream(data)
        .toMap(function (obj) {
            return obj["lastName"];
        });

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"], data[0]);
    assert.equal(map["Doe"], data[1]);

}
@test 'toMap path'() {

    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = Stream(data)
        .toMap("lastName");

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"], data[0]);
    assert.equal(map["Doe"], data[1]);

}
@test 'toMap empty'() {

    var map = Stream([])
        .toMap(function (obj) {
            return obj["lastName"];
        });

    assert.equal(Object.keys(map).length, 0);

}
@test 'toMap duplicate key'() {

    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    assert.throws(function () {
        Stream(data)
            .toMap(function (obj) {
                return obj["lastName"];
            });
    });

}
@test 'toMap duplicate key merge'() {

    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = Stream(data)
        .indexBy(function (obj) {
            return obj["lastName"];
        }, function (val1) {
            return val1;
        });

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"], data[0]);
    assert.equal(map["Doe"], data[2]);

}

}
