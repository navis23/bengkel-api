module.exports = mongoose => {

    const { Schema } = mongoose;

    const schema = new Schema(
        {
            kode_key_temp : {
                type : String,
                required : true
            },
            kode_detail_temp : {
                type : String,
                required : true
            },
            produk: {
                    type : mongoose.SchemaTypes.ObjectId,
                    ref : "products"
            },
            harga_tmp : {
                type : Number,
                required : true
            },
            jumlah_tmp : {
                type : Number,
                required : true
            },
            subtotal_tmp : Number,
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
    return mongoose.model("detailtrxtemps", schema);
    // return Category
}