import Base from "./base";
import * as constant from "../common/constant";

class Eth extends Base {

    protected dbName: string = "eth";

    constructor() {
        super(constant.mongo.eth.name)
    }
}

export default Eth