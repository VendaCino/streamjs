// I'm using Babel.js and Intellij IDEA File Watcher to automatically transpile es6 to js:
// --source-maps --out-file $FileNameWithoutExtension$-compiled.js $FilePath$


import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Constructorses6 {
@test 'input ES6 iterator'() {

    function* iterator() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
        yield 5;
        yield 6;
    }

    var result = Stream(iterator())
      .filter(function(i) {
          return i % 2 === 1;
      })
      .toArray();

    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);
    assert.equal(result[2], 5);

}
@test 'input ES6 set'() {

    var data = new Set([1, 2, 3, 4, 5, 6]);

    var result = Stream(data)
        .filter(function (i) {
            return i % 2 === 1;
        })
        .toArray();

    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);
    assert.equal(result[2], 5);

}
@test 'input ES6 map'() {

    var data = new Map();
    data.set("key1", 1);
    data.set("key2", 2);
    data.set("key3", 3);

    var result = Stream(data)
        .filter(function (i) {
            return i % 2 === 1;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);

}

}
