
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'input array'() {

    var input = [1, 2, 3];
    var result = Stream(input).toArray();
    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);

}
@test 'input undefined'() {

    var result = Stream(undefined).toArray();
    assert.equal(result.length, 0);

}
@test 'input null'() {

    var result = Stream(null).toArray();
    assert.equal(result.length, 0);

}
@test 'input makeshift iterator'() {

  function iter(){
    var index = 0;

    return {
       next: function(){
           if (index >= 10) return;
           return { value: index++, done: (index >= 10) };
       }
    };
  }

  var input = iter();
  var result = Stream(input)
    .filter(function(i) {
        return i % 2;
    })
    .takeWhile(function(i) {
        return i < 7;
    })
    .toArray();

  assert.equal(result.length, 3);
  assert.equal(result[0], 1);
  assert.equal(result[1], 3);
  assert.equal(result[2], 5);

}
@test 'input stream iterator'() {

  var input = Stream.of(1, 2, 3, 4, 5).iterator();
  var result = Stream(input)
    .filter(function(i) {
        return i % 2;
    })
    .toArray();

  assert.equal(result.length, 3);
  assert.equal(result[0], 1);
  assert.equal(result[1], 3);
  assert.equal(result[2], 5);

}
@test 'input object'() {

    var input = {
        foo: 1, bar: 2, foobar: 3
    };

    var result = Stream(input).toArray();
    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);

}
@test 'input string'() {

    var result = Stream("abcd")
        .filter(function (c) {
            return c !== 'b';
        })
        .map(function (c) {
            return c.toUpperCase();
        })
        .joining();

    assert.equal(result, "ACD");

}
@test 'from array'() {

    var input = [1, 2, 3];
    var result = Stream.from(input).toArray();
    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);

}
@test 'from undefined'() {

    var result = Stream.from(undefined).toArray();
    assert.equal(result.length, 0);

}
@test 'from null'() {

    var result = Stream.from(null).toArray();
    assert.equal(result.length, 0);

}
@test 'from object'() {

    var input = {
        foo: 1, bar: 2, foobar: 3
    };

    var result = Stream.from(input).toArray();
    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);

}
@test 'from string'() {

    var result = Stream.from("abcd")
        .filter(function (c) {
            return c !== 'b';
        })
        .map(function (c) {
            return c.toUpperCase();
        })
        .joining();

    assert.equal(result, "ACD");

}
@test 'of'() {

    var result = Stream.of(1, 2, 3, 4)
        .filter(function (num) {
            return num % 2 === 1;
        })
        .map(function (num) {
            return "odd" + num;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], "odd1");
    assert.equal(result[1], "odd3");

}
@test 'empty'() {

    var result = Stream.empty().toArray();
    assert.equal(result.length, 0);

}
@test 'range'() {

    var result = Stream.range(0, 4).toArray();
    assert.equal(result.length, 4);
    assert.equal(result[0], 0);
    assert.equal(result[1], 1);
    assert.equal(result[2], 2);
    assert.equal(result[3], 3);

}
@test 'rangeClosed'() {

    var result = Stream.rangeClosed(0, 4).toArray();
    assert.equal(result.length, 5);
    assert.equal(result[0], 0);
    assert.equal(result[1], 1);
    assert.equal(result[2], 2);
    assert.equal(result[3], 3);
    assert.equal(result[4], 4);

}
@test 'generate'() {

    var result = Stream
        .generate(Math.random)
        .limit(10)
        .toArray();

    assert.equal(result.length, 10);

}
@test 'iterate'() {

    var result = Stream
        .iterate(1, function (seed) {
            return seed * 2;
        })
        .limit(11)
        .toArray();

    assert.equal(result.length, 11);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 4);
    assert.equal(result[3], 8);
    assert.equal(result[4], 16);
    assert.equal(result[5], 32);
    assert.equal(result[6], 64);
    assert.equal(result[7], 128);
    assert.equal(result[8], 256);
    assert.equal(result[9], 512);
    assert.equal(result[10], 1024);

}

}
