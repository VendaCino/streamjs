
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class TakeWhile {
@test 'takeWhile num array'() {

    var data = [1, 2, 3, 2, 1];

    var result = Stream(data)
        .takeWhile(function (num) {
            return num < 3;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);

    // assert original data is untouched
    assert.equal(data.length, 5);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 2);
    assert.equal(data[4], 1);

}
@test 'takeWhile object'() {

    var data = {a: 1, b: 2, c: 3, d: 2};

    var result = Stream(data)
        .takeWhile(function (num) {
            return num < 3;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);

    // assert original data is untouched
    assert.equal(data.a, 1);
    assert.equal(data.b, 2);
    assert.equal(data.c, 3);
    assert.equal(data.d, 2);

}
@test 'takeWhile empty'() {

    var result = Stream([])
        .takeWhile(function () {
            return true;
        })
        .toArray();

    assert.equal(result.length, 0);

}
@test 'takeWhile via regexp literal'() {

    var data = ["a1", "a2", "b3", "a4"];

    var result = Stream(data)
        .takeWhile(/a.*/)
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], "a1");
    assert.equal(result[1], "a2");

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], "a1");
    assert.equal(data[1], "a2");
    assert.equal(data[2], "b3");
    assert.equal(data[3], "a4");

}
@test 'takeWhile via regexp object'() {

    var data = ["a1", "a2", "b3", "a4"];

    var result = Stream(data)
        .takeWhile(new RegExp("a.*"))
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], "a1");
    assert.equal(result[1], "a2");

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], "a1");
    assert.equal(data[1], "a2");
    assert.equal(data[2], "b3");
    assert.equal(data[3], "a4");

}
@test 'takeWhile via sample object (depth=1)'() {

    var data = [
        {a: 1, b: 1},
        {a: 1, b: 2},
        {a: 2, b: 3},
        {a: 1, b: 4}
    ];

    var result = Stream(data)
        .takeWhile({a: 1})
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0].a, 1);
    assert.equal(result[0].b, 1);
    assert.equal(result[1].a, 1);
    assert.equal(result[1].b, 2);

}
@test 'takeWhile via sample object (depth=2)'() {

    var data = [
        {a: 1, b: 1, c: {x: "x1"}},
        {a: 1, b: 2, c: {x: "x1"}},
        {a: 2, b: 3, c: {x: "x3"}},
        {a: 1, b: 4, c: {x: "x1"}}
    ];

    var result = Stream(data)
        .takeWhile({a: 1, c: {x: "x1"}})
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0].a, 1);
    assert.equal(result[0].b, 1);
    assert.equal(result[0].c.x, "x1");
    assert.equal(result[1].a, 1);
    assert.equal(result[1].b, 2);
    assert.equal(result[1].c.x, "x1");

}

}
