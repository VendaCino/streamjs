
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite
class Test {
@test 'Optional get 1'() {

    var result = Stream.Optional.of(1).get();
    assert.equal(result, 1);

}
@test 'Optional get 2'() {

    assert.throws(function () {
        Stream.Optional.ofNullable(null).get();
    });

    assert.throws(function () {
        Stream.Optional.ofNullable(undefined).get();
    });

}
@test 'Optional of'() {

    assert.throws(function () {
        Stream.Optional.of(null);
    });

    assert.throws(function () {
        Stream.Optional.of(undefined);
    });

}
@test 'Optional ifPresent 1'() {

    var result = null;
    Stream.Optional.of(1)
        .ifPresent(function () {
            result = "called";
        });
    assert.equal(result, "called");

}
@test 'Optional ifPresent 2'() {

    var result = null;
    Stream.Optional.empty()
        .ifPresent(function () {
            result = "called";
        });
    assert.equal(result, null);

}
@test 'Optional orElse 1'() {

    var result = Stream.Optional.of(1).orElse(2);
    assert.equal(result, 1);

}
@test 'Optional orElse 2'() {

    var result = Stream.Optional.empty().orElse(2);
    assert.equal(result, 2);

}
@test 'Optional orElseGet 1'() {

    var result = Stream.Optional.of(1).orElseGet(function () {
        return 2;
    });
    assert.equal(result, 1);

}
@test 'Optional orElseGet 2'() {

    var result = Stream.Optional.empty().orElseGet(function () {
        return 2;
    });
    assert.equal(result, 2);

}
@test 'Optional orElseThrow 1'() {

    var result = Stream.Optional.of(1).orElseThrow("error");
    assert.equal(result, 1);

}
@test 'Optional orElseThrow 2'() {

    assert.throws(function () {
        Stream.Optional.empty().orElseThrow("error");
    });

}
@test 'Optional filter 1'() {

    var optional = Stream.Optional.of(3).filter(function (num) {
        return num > 2;
    });
    assert.equal(optional.isPresent(), true);
    assert.equal(optional.get(), 3);

}
@test 'Optional filter 2'() {

    var optional = Stream.Optional.of(3).filter(function (num) {
        return num > 3;
    });
    assert.equal(optional.isPresent(), false);

}
@test 'Optional filter 3'() {

    var optional = Stream.Optional.empty().filter(function (num) {
        return num > 3;
    });
    assert.equal(optional.isPresent(), false);

}
@test 'Optional map 1'() {

    var optional = Stream.Optional.of(3).map(function (num) {
        return "num" + num;
    });
    assert.equal(optional.isPresent(), true);
    assert.equal(optional.get(), "num3");

}
@test 'Optional map 2'() {

    var optional = Stream.Optional.empty().map(function (num) {
        return "num" + num;
    });
    assert.equal(optional.isPresent(), false);

}
@test 'Optional flatMap 1'() {

    var optional = Stream.Optional.of(3).flatMap(function (num) {
        return Stream.Optional.of("num" + num);
    });
    assert.equal(optional.isPresent(), true);
    assert.equal(optional.get(), "num3");

}
@test 'Optional flatMap 2'() {

    var optional = Stream.Optional.empty().map(function (num) {
        return Stream.Optional.of("num" + num);
    });
    assert.equal(optional.isPresent(), false);

}
@test 'toString'() {

    var optional = Stream.Optional.empty();
    assert.equal(optional.toString(), "[object Optional]");

}

}
