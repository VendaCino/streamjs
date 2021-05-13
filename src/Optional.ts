var ctx = {};
export class Optional {

    private val:any|undefined|null;


    constructor(val: any) {
        this.val = val;
    }

    static of(val){
        if (val === null || val === undefined) {
            throw "value must be present";
        }
        return new Optional(val);
    };

    static ofNullable(val){
        return new Optional(val);
    };

    static empty(){
        return new Optional(undefined);
    };

    isPresent(){
        return this.val !== null && this.val !== undefined;
    };

    get(){
        if (!this.isPresent()) {
            throw "optional this.value is not present";
        }
        return this.val;
    };

    ifPresent(consumer){
        if (this.isPresent()) {
            consumer.call(this.val, this.val);
        }
    };

    orElse(otherVal){
        if (this.isPresent()) {
            return this.val;
        }
        return otherVal;
    };

    orElseGet(supplier){
        if (this.isPresent()) {
            return this.val;
        }
        return supplier.call(ctx);
    };

    orElseThrow(errorMsg){
        if (this.isPresent()) {
            return this.val;
        }
        throw errorMsg;
    };

    filter(predicate){
        if (this.isPresent()) {
            var filtered = predicate.call(ctx, this.val);
            if (filtered) {
                return this;
            }
            return Optional.empty();
        }
        return this;
    };

    map(mapper){
        if (this.isPresent()) {
            var mappedVal = mapper.call(ctx, this.val);
            return Optional.ofNullable(mappedVal);
        }
        return this;
    };

    flatMap(flatMapper){
        if (this.isPresent()) {
            return flatMapper.call(ctx, this.val);
        }
        return this;
    };

    toString() {
        return "[object Optional]";
    };
}



