const dbConfig = require("../config/db");
const mongoose = require("mongoose");

// mongoose.Promise = global.Promise

// const db = {}
// db.mongoose = mongoose
// db.url = dbConfig.url
// db.categories = require('./category.model')(mongoose)

// module.exports = db

module.exports = {
    mongoose,
    url: dbConfig.url,
    categories: require('./category.model')(mongoose),
    products: require('./product.model')(mongoose),
    suppliers: require('./supplier.model')(mongoose),
    transactions: require('./transaction.model')(mongoose),
    detailtrxs: require('./detailtrx.model')(mongoose),
    detailtrxtemps: require('./detailtrxtemp.model')(mongoose),
}
