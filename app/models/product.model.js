module.exports = mongoose => {

    const { Schema } = mongoose;

    const schema = new Schema(
        {
            kode_produk: {
                type : String,
                required : true,
                unique : true,
                uppercase : true
            },
            nama_produk: {
                type : String,
                required : true
            },
            kategori_produk: {
                type : mongoose.SchemaTypes.ObjectId,
                ref : "categories" 
            },
            harga_baru: {
                type : Number,
                required : true
            },
            harga_lama: {
                type : Number,
            },
            stok_baru: {
                type : Number,
                required : true
            },
            stok_lama: {
                type : Number,
            },
            foto : {
                type : String,
            }
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
    return mongoose.model("products", schema);
    // return Category
}