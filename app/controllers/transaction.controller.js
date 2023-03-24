const db = require("../models")
const Transaction = db.transactions;
const fs = require('fs');
const path = require("path")

exports.findAll = async (req, res) => {

    const currentPage = req.query.page || 1;
    const perPage = req.query.limit || 10;
    const search = req.query.search || '';

    let totalItems;

    await Transaction.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r
        return await Transaction.find({ kode_transaksi : {$regex : search, $options : "i"}})
        .skip((parseInt(currentPage - 1) * perPage))
        .limit(parseInt(perPage))
        .populate({path: 'detail'})
        .populate({path: 'supplier'})
        .sort({ createdAt : -1 })
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
            message : err.message || "some error while retreiving transaction data."
        })
    });
}

exports.create = async (req, res) => {
    // console.log('test array terakhir' + JSON.stringify(testingo.value))
    let generateKode = ''

    await Transaction.find()
    .then( result => {

        const lastKode = result.length == 0 || null ? 'TRX0000' : result[result.length - 1].kode_transaksi

        const checkKode = result.length == 0 || null ? 'TRX0000' : lastKode


        let strings = checkKode.replace(/[0-9]/g, '');
            let digits = (parseInt(checkKode.replace(/[^0-9]/g, '')) + 1).toString();
            if(digits.length < 4)
                digits = ("000"+digits).slice(-4);
                generateKode = strings + digits;

    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction data."
        })
    });
    
    const transaction = await new Transaction({
        kode_transaksi : generateKode,
        detail : req.body.detail,
        supplier : req.body.supplier,
        total : req.body.total,
        catatan : req.body.catatan,
    })

    await transaction.save()
    .then( result => {
        res.status(200).send(
            {
                message : "data berhasil disimpan",
                data : result
            }
        )
    })
    .catch( err => {
        res.status(409).send({
            message : "msg error :" + err.message || "some error while create new transaction data.",
        })
    })
}

exports.show = async (req, res) => {
    await Transaction.findOne({
        _id : req.body.id
    })
    .then( result => {
        res.send(result)
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction data."
        })
    });
}

exports.delete = async (req, res) => {

    await Transaction.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        await Transaction.deleteOne({
        _id : result.id
        })
        .then( r => {
            res.send({r, msg : 'data berhasil dihapus'})
        })
        .catch( err => {
            res.status(500).send({
                message : err.message || "some error while retreiving transaction data."
            })
        });
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction data."
        })
    });

    
}

exports.update = async (req, res) => {

    await Transaction.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        
        await Transaction.updateOne({_id : result.id}, { 
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
                message : "msg error :" + error.message || "some error while create new transaction data.",
            })
        })
        
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction data."
        })
    });

    
}

exports.allData = async (req, res) => {

    let totalItems;

    await Transaction.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r
        return await Transaction.find()
        .populate({path: 'detail'})
        .populate({path: 'supplier'})
        .sort({ createdAt : -1 })
    })
    .then( result => {
        res.send({
            data : result,
            total_data : totalItems
        })
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction data."
        })
    });
}
