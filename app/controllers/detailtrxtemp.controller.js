const db = require("../models")
const Detailtrxtemp = db.detailtrxtemps;
const fs = require('fs');
const path = require("path")

exports.findAll = async (req, res) => {

    let totalItems;

    await Detailtrxtemp.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r

        return await Detailtrxtemp.find({
            kode_key_temp : req.body.kode_key_temp
        })
        .populate(
            // {path: 'produk', select:['kode_produk', 'nama_produk']}
            {path: 'produk'}
        )
        .sort({ kode_key_temp : -1 })
    })
    .then( result => {
        res.send({
            data : result,
            total_data : totalItems,
            
        })
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction detail temporary data."
        })
    });
}

exports.create = async (req, res) => {
    // console.log('test array terakhir' + JSON.stringify(testingo.value))
    let generateKode = ''

    await Detailtrxtemp.find()
    .then( result => {

        const lastKode = result.length == 0 || null ? 'DTMP0000' : result[result.length - 1].kode_detail_temp

        const checkKode = result.length == 0 || null ? 'DTMP0000' : lastKode

        let strings = checkKode.replace(/[0-9]/g, '');
            let digits = (parseInt(checkKode.replace(/[^0-9]/g, '')) + 1).toString();
            if(digits.length < 4)
                digits = ("000"+digits).slice(-4);
                generateKode = strings + digits;
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction detail temporary data."
        })
    });
    
    const detailtrxtemp = await new Detailtrxtemp({
        kode_key_temp :req.body.kode_key_temp,
        kode_detail_temp : generateKode,
        produk :req.body.produk,
        harga_tmp : req.body.harga_tmp,
        jumlah_tmp : req.body.jumlah_tmp,
        subtotal_tmp : req.body.harga_tmp * req.body.jumlah_tmp
    })

    await detailtrxtemp.save()
    .then( result => {
        res.status(200).send(result)
    })
    .catch( err => {
        res.status(409).send({
            message : "msg error :" + err.message || "some error while create new transaction detail temporary data.",
        })
    })
}

exports.delete = async (req, res) => {

    await Detailtrxtemp.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        await Detailtrxtemp.deleteOne({
        _id : result.id
        })
        .then( r => {
            res.send({r, msg : 'data berhasil dihapus'})
        })
        .catch( err => {
            res.status(500).send({
                message : err.message || "some error while retreiving transaction detail temporary data."
            })
        });
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction detail temporary data."
        })
    });

    
}

exports.deleteAllByKey = async (req, res) => {
    await Detailtrxtemp.deleteMany({
    kode_key_temp : req.body.kode_key_temp
    })
    .then( r => {
        res.send({r, msg : 'semua data berhasil dihapus berdasarkan key-temp'})
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction detail temporary data."
        })
    });
}

exports.update = async (req, res) => {

    await Detailtrxtemp.findOne({
        _id : req.body.id
    })
    .then( async (result) => {

        await Detailtrxtemp.updateOne({_id : result.id}, { 
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
                message : "msg error :" + error.message || "some error while create new transaction detail temporary data.",
            })
        })
        
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction detail temporary data."
        })
    });

    
}
