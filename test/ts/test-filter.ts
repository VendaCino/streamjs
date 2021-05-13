
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'filter num array'() {

    var data = [1, 2, 3, 4];

    var result = Stream(data)
        .filter(function (num) {
            return num % 2 === 1;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);

}
@test 'filter object array'() {

    var data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

    var result = Stream(data)
        .filter(function (obj) {
            return obj.a % 2 === 1;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0].a, 1);
    assert.equal(result[1].a, 3);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a, 1);
    assert.equal(data[1].a, 2);
    assert.equal(data[2].a, 3);
    assert.equal(data[3].a, 4);

}
@test 'filter object'() {

    var data = {a: 1, b: 2, c: 3, d: 4};

    var result = Stream(data)
        .filter(function (num) {
            return num % 2 === 1;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);

    // assert original data is untouched
    assert.equal(data.a, 1);
    assert.equal(data.b, 2);
    assert.equal(data.c, 3);
    assert.equal(data.d, 4);

}
@test 'filter empty'() {

    var result = Stream([])
        .filter(function () {
            return true;
        })
        .toArray();

    assert.equal(result.length, 0);

}
@test 'filter with null'() {

    var result = Stream([1, null, undefined, 2])
        .filter(function () {
            return true;
        })
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], null);
    assert.equal(result[2], undefined);
    assert.equal(result[3], 2);

}
@test 'filter via regexp literal'() {

    var data = ["a1", "a2", "b3"];

    var result = Stream(data)
        .filter(/a.*/)
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], "a1");
    assert.equal(result[1], "a2");

    // assert original data is untouched
    assert.equal(data.length, 3);
    assert.equal(data[0], "a1");
    assert.equal(data[1], "a2");
    assert.equal(data[2], "b3");

}
@test 'filter via regexp object'() {

    var data = ["a1", "a2", "b3"];

    var result = Stream(data)
        .filter(new RegExp("a.*"))
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], "a1");
    assert.equal(result[1], "a2");

    // assert original data is untouched
    assert.equal(data.length, 3);
    assert.equal(data[0], "a1");
    assert.equal(data[1], "a2");
    assert.equal(data[2], "b3");

}
@test 'filter via sample object (depth=1)'() {

    var data = [
        {a: 1, b: 1},
        {a: 2, b: 2},
        {a: 1, b: 3}
    ];

    var result = Stream(data)
        .filter({a: 1})
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0].a, 1);
    assert.equal(result[0].b, 1);
    assert.equal(result[1].a, 1);
    assert.equal(result[1].b, 3);

}
@test 'filter via sample object (depth=2)'() {

    var data = [
        {a: 1, b: 1, c: {x: "x1"}},
        {a: 2, b: 2, c: {x: "x2"}},
        {a: 1, b: 3, c: {x: "x3"}},
        {a: 1, b: 4, c: {x: "x1"}}
    ];

    var result = Stream(data)
        .filter({a: 1, c: {x: "x1"}})
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0].a, 1);
    assert.equal(result[0].b, 1);
    assert.equal(result[0].c.x, "x1");
    assert.equal(result[1].a, 1);
    assert.equal(result[1].b, 4);
    assert.equal(result[1].c.x, "x1");

}

}
