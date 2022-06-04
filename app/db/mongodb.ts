const constant = require('../common/constant');
const GenericPool = require('generic-pool');
const MongodbClient = require('mongodb').MongoClient;

const factory = {
    create: function () {
        //USE Server optional to support remote url
        return MongodbClient.connect(constant.mongo.host, {useUnifiedTopology: true, useNewUrlParser: true});
    },

    destroy: function (client:any) {
        client.close();
    }
}
const opts = {
    max: 5000,
    min: 10,
    idleTimeoutMillis: 30000
}

const myPool = GenericPool.createPool(factory, opts);

module.exports = myPool;