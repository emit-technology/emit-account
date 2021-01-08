const constant = require('../common/constant');
const GenericPool = require('generic-pool');
const MongodbClient = require('mongodb').MongoClient;

const factory = {
    create: function () {
        return MongodbClient.connect(constant.mongo.host, {useUnifiedTopology: true,useNewUrlParser:true});
    },

    destroy: function (client) {
        client.close();
    }
}
const opts = {
    max: 500,
    min: 10
}

const myPool = GenericPool.createPool(factory, opts);

module.exports = myPool;