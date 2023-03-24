module.exports = mongoose => {

    const { Schema } = mongoose;

    const schema = new Schema(
        {
            kode_transaksi : {
                type : String,
                required : true
            },
            detail: {
                type : mongoose.SchemaTypes.ObjectId,
                ref : "detailtrxs" 
            },
            supplier: {
                type : mongoose.SchemaTypes.ObjectId,
                ref : "suppliers" 
            },
            total: {
                type : Number,
                required : true,
                default : 0
            },
            catatan: {
                type : String,
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
    return mongoose.model("transactions", schema);
    // return Category
}