module.exports = mongoose => {

    const { Schema } = mongoose;

    const schema = new Schema(
        {
            kode_supplier : {
                type : String,
                required : true
            },
            nama_supplier: {
                type : String,
                required : true,
            },
            nomor_supplier: {
                type : String,
                required : true,
            },
            alamat_supplier: {
                type : String,
                required : true,
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
    return mongoose.model("suppliers", schema);
    // return Category
}