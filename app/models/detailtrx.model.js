module.exports = mongoose => {

    const { Schema } = mongoose;

    const schema = new Schema(
        {
            kode_trx : {
                type : mongoose.SchemaTypes.ObjectId,
                ref : "transactions"
            },
            kode_detail_trx : {
                type : String,
                required : true
            },
            trx_produk: [{
                    trx_kode : String,
                    trx_nama : String,
                    trx_harga : Number,
                    trx_jumlah : Number,
                    trx_subtotal : Number,
            }],
            total_trx : {
                type : Number,
                required : true
            },
        }, {
            timestamps : true
        }
    );

    schema.method("toJSON", function() {
        const {__v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    });

    // const Category = mongoose.model("categories", schema);
    return mongoose.model("detailtrxs", schema);
    // return Category
}