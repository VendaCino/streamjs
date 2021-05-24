import {Stream} from "./TsStream";

console.log("123")
let number = Stream([1, 2, 3]).map((e: number)=>e + 1).reduce((a,b)=>a+b).get();

console.log(number)
