class Cache {

    data: Array<any>
    max: number

    constructor(max: number) {
        this.data = []
        this.max = max;
    }

    has = (d: any): boolean => {
        return this.data.indexOf(d) > -1
    }

    push = (d: any): boolean => {
        if (this.has(d)) {
            return false
        }
        if (this.data.length >= this.max) {
            this.data.shift()
        }
        this.data.push(d)
        return true
    }

    concat = (arr:Array<any>) =>{
        const lo = this.data.length + arr.length - this.max;
        if(lo>0){
            if(lo >= this.data.length){
                this.data = [];
            }else {
                this.data = this.data.slice(lo)
            }
        }
        this.data = this.data.concat(arr)
    }

    length = ()=>{
        return this.data.length
    }
}

export default Cache