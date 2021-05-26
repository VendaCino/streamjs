import * as fs from 'fs';
import {WriteFileOptions} from "fs";
// fs.readFileSync('foo.txt','utf8');
const folderPath = '../test';
const outPath = '../test/dart';
function transAll() {
    for (const path of fs.readdirSync(folderPath)) {

        if (path.startsWith("test-")) {
            let data = fs.readFileSync(`${folderPath}/${path}`, "utf-8");
            let name = path.substring(5,6).toUpperCase()+path.substring(6)
                .replace("-","_").replace(".js","")
                .replace(".","_")
            ;
            let dataAfterTrans=trans(data,name);
            fs.writeFileSync(`${outPath}/${
                path
                    .replace('.js', '_test.dart')
                    .replace('-','_')
                    
            }`, dataAfterTrans);
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
import 'package:flutter_test/flutter_test.dart';
import 'package:quick_init/special/streamdart/streamdart.dart';
void main(){\n`;
    let match:RegExpExecArray | null;
    let preStart = -1;
    let restStart = 0;
    while((match = regex.exec(code))) {
        const [,key, value] = match;
        result += `test('${key}', () {\n${value}\n});\n`;
        restStart = match.index+match.length;
        if(preStart === -1) preStart = match.index;
    }
    if(restStart<code.length){
        if((match = regex2.exec(code.substring(restStart)))) {
            const [,key, value] = match;
            result += `test( '${key}',() {\n${value}\n});\n`;
        }
    }
    result+="\n}\n";
    if(preStart!==-1){
        result=code.substring(0,preStart)+result;
    }

    const regex3 = /assert\.equal\((.*?),(.*?)\);/g;
    result = result.replace(regex3,'expect($1, equals($2));')
    result = result.replace(/Stream\(/g,'DartStream.of(')
    result = result.replace(/function \(/g,'(')
    result = result.replace(/\{a: (.*?), b: (.*?)}/g,"_Obj($1, $2)")
    return result;
}

console.log(trans(test));
transAll();
