import {Stream} from "./TsStream";
import {IPipeline} from "./Pipeline";

console.log("123")
let number = Stream([1, 2, 3]).map(e => e + 1).count();

console.log(number)
