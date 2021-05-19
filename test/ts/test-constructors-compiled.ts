// I'm using Babel.js and Intellij IDEA File Watcher to automatically transpile es6 to js:
// --source-maps --out-file $FileNameWithoutExtension$-compiled.js $FilePath$

"use strict";


import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Constructorscompiled {
/*@test*/ 'input ES6 iterator'() {

    var marked1$0 = [iterator].map(regeneratorRuntime.mark);

    function iterator() {
        return regeneratorRuntime.wrap(function iterator$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return 1;

                case 2:
                    context$2$0.next = 4;
                    return 2;

                case 4:
                    context$2$0.next = 6;
                    return 3;

                case 6:
                    context$2$0.next = 8;
                    return 4;

                case 8:
                    context$2$0.next = 10;
                    return 5;

                case 10:
                    context$2$0.next = 12;
                    return 6;

                case 12:
                case "end":
                    return context$2$0.stop();
            }
        }, marked1$0[0], this);
    }

    var result = Stream(iterator()).filter(function (i) {
        return i % 2 === 1;
    }).toArray();

    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);
    assert.equal(result[2], 5);

}
@test 'input ES6 set'() {

    var data = new Set([1, 2, 3, 4, 5, 6]);

    var result = Stream(data).filter(function (i) {
        return i % 2 === 1;
    }).toArray();

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

    var result = Stream(data).filter(function (i) {
        return i % 2 === 1;
    }).toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);

}

}
