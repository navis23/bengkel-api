const db = require("../models")
const Product = db.products;
const fs = require('fs');
const path = require("path")

exports.findAll = async (req, res) => {

    const currentPage = req.query.page || 1;
    const perPage = req.query.limit || 10;
    const search = req.query.search || '';

    let totalItems;

    await Product.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r

        return await Product.find({ nama_produk : {$regex : search, $options : "i"}})
        .skip((parseInt(currentPage - 1) * perPage))
        .limit(parseInt(perPage))
        .populate({path: 'kategori_produk', select:['kode_kategori', 'nama_kategori']})
        .sort({ updatedAt : -1 })
    })
    .then( result => {
        res.send({
            data : result,
            total_data : totalItems,
            page : currentPage,
            limit : perPage,
            search : search
        })
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });
}

exports.create = async (req, res) => {
    // console.log('test array terakhir' + JSON.stringify(testingo.value))
    let generateKode = ''

    await Product.find()
    .then( result => {

        const lastKode = result.length == 0 || null ? 'BG0000' : result[result.length - 1].kode_produk

        const checkKode = result.length == 0 || null ? 'BG0000' : lastKode


        let strings = checkKode.replace(/[0-9]/g, '');
            let digits = (parseInt(checkKode.replace(/[^0-9]/g, '')) + 1).toString();
            if(digits.length < 4)
                digits = ("000"+digits).slice(-4);
                generateKode = strings + digits;

    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });
    
    const product = await new Product({
        kode_produk : generateKode,
        nama_produk : req.body.nama_produk,
        kategori_produk : req.body.kategori_produk,
        harga_baru : req.body.harga_baru,
        harga_lama : req.body.harga_lama,
        stok_baru : req.body.stok_baru,
        stok_lama : req.body.stok_lama,
        foto : req.file ? req.file.path : '',
    })

    await product.save()
    .then( result => {
        res.status(200).send({message : "data berhasil disimpan : " + result.id})
    })
    .catch( err => {
        res.status(409).send({
            message : "msg error :" + err.message || "some error while create new category data.",
        })
        if(req.file) {
            fs.unlinkSync(path.join(req.file.path));
            console.log('file dihapus')
         }
    })
}

exports.show = async (req, res) => {
    await Product.findOne({
        _id : req.body.id
    })
    .then( result => {
        res.send(result)
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });
}

exports.delete = async (req, res) => {

    await Product.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        await Product.deleteOne({
        _id : result.id
        })
        .then( r => {
            res.send({r, msg : 'data berhasil dihapus'})
            console.log(result.foto)
                fs.unlink(
                      path.join(result.foto),
                         (err) => console.log(err + ' file berhasil dihapus'));
        })
        .catch( err => {
            res.status(500).send({
                message : err.message || "some error while retreiving category data."
            })
        });
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });

    
}

exports.update = async (req, res) => {

    await Product.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        if(req.file && result.foto != "") {
            fs.unlinkSync(path.join(result.foto))
        }

        await Product.updateOne({_id : result.id}, { 
            $set : {
                nama_produk : req.body.nama_produk ? req.body.nama_produk : result.nama_produk,
                kategori_produk : req.body.kategori_produk ? req.body.kategori_produk : result.kategori_produk,
                harga_baru : req.body.harga_baru ? req.body.harga_baru : result.harga_baru,
                harga_lama : req.body.harga_lama ? req.body.harga_lama : result.harga_lama,
                stok_baru : req.body.stok_baru ? req.body.stok_baru : result.stok_baru,
                stok_lama : req.body.stok_lama ? req.body.stok_lama : result.stok_lama,
                foto : req.file ? req.file.path : result.foto
            }
        } )
        .then( r => {
            res.status(200).send({message : "data berhasil diupdate"})
        })
        .catch( error => {
            res.status(409).send({
                message : "msg error :" + error.message || "some error while create new category data.",
            })
            if(req.file) {
                fs.unlink(
                    path.join(req.file.path),
                        (err) => console.log(err + ' file berhasil dihapus'));
            }
        })
        
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });

    
}

exports.dashboard = async (req, res) => {

   
    let totalItems;

    await Product.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r

        return await Product.find()
        .populate({path: 'kategori_produk', select:['kode_kategori', 'nama_kategori']})
        .sort({ updatedAt : -1 })
    })
    .then( result => {
        res.send({
            data : result,
            total_data : totalItems,
        })
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });
}