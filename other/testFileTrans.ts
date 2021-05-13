import * as fs from 'fs';
import {WriteFileOptions} from "fs";
// fs.readFileSync('foo.txt','utf8');
const folderPath = '../test';
const outPath = '../test/ts';
function transAll() {
    for (const path of fs.readdirSync(folderPath)) {

        if (path.startsWith("test-")) {
            let data = fs.readFileSync(`${folderPath}/${path}`, "utf-8");
            let dataAfterTrans=trans(data);
            fs.writeFileSync(`${outPath}/${path.replace('.js', '.ts')}`, dataAfterTrans);
        }

    }
}

const test=`
QUnit.test("allMatch true", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .allMatch(function (num) {
            return num > 0;
        });
    assert.equal(result, true);
});

QUnit.test("allMatch false", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .allMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, false);
});

QUnit.test("allMatch empty", function (assert) {
    var result = Stream([])
        .allMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, true);
});

`
function trans(code:string,name?:string):string{
    const regex = /QUnit\.test\("(.*?)", function \(assert\) \{([\s\S]+?)}\);[\s\n]*?(?=QUnit)/g
    const regex2 = /QUnit\.test\("(.*?)", function \(assert\) \{([\s\S]+)}\);/g

    let result=`
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Stream} from "../../src/TsStream";

@suite\nclass ${name??"Test"} {\n`;
    let match:RegExpExecArray | null;
    let restStart = 0;
    while((match = regex.exec(code))) {
        const [,key, value] = match;
        result += `@test '${key}'() {\n${value}\n}\n`;
        restStart = match.index+match.length;
    }
    if(restStart<code.length){
        if((match = regex2.exec(code.substring(restStart)))) {
            const [,key, value] = match;
            result += `@test '${key}'() {\n${value}\n}\n`;
        }
    }
    result+="\n}\n";
    return result;
}

console.log(trans(test));
transAll();
