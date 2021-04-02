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
}

export default Cache