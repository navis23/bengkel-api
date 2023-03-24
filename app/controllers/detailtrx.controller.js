const db = require("../models")
const Detailtrx = db.detailtrxs;
const Detailtrxtemp = db.detailtrxtemps;
const Product = db.products;
const fs = require('fs');
const path = require("path")

exports.findAll = async (req, res) => {

    let totalItems;

    await Detailtrx.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r

        return await Detailtrx.find()
        .sort({ kode_detail_trx : 1 })
    })
    .then( result => {
        res.send({
            data : result,
            total_data : totalItems,
            
        })
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction detail data."
        })
    });
}

exports.create = async (req, res) => {
    // console.log('test array terakhir' + JSON.stringify(testingo.value))
    let generateKode = ''

    await Detailtrx.find()
    .then( result => {

        const lastKode = result.length == 0 || null ? 'DTRX0000' : result[result.length - 1].kode_detail_trx

        const checkKode = result.length == 0 || null ? 'DTRX0000' : lastKode

        let strings = checkKode.replace(/[0-9]/g, '');
            let digits = (parseInt(checkKode.replace(/[^0-9]/g, '')) + 1).toString();
            if(digits.length < 4)
                digits = ("000"+digits).slice(-4);
                generateKode = strings + digits;
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction detail data."
        })
    });

    await Detailtrxtemp.find({
        kode_key_temp : req.body.kode_key_temp
    })
    .populate({path: 'produk'})
    .then( async (rslt) => {
        // res.status(200).send(rslt)

        let produk_tmp = [];
        let total_temp = [];
        for (let i = 0; i < rslt.length; i++) {
            produk_tmp.push({
                trx_kode : rslt[i].produk.kode_produk,
                trx_nama : rslt[i].produk.nama_produk,
                trx_harga : rslt[i].harga_tmp,
                trx_jumlah : rslt[i].jumlah_tmp,
                trx_subtotal : rslt[i].subtotal_tmp,
            });

            const stokChange = rslt[i].produk.stok_baru + rslt[i].jumlah_tmp

            await Product.updateOne({_id : rslt[i].produk.id}, { 
                $set : {
                    harga_baru : rslt[i].harga_tmp,
                    harga_lama : rslt[i].produk.harga_baru,
                    stok_baru :stokChange,
                    stok_lama : rslt[i].produk.stok_baru,
                }
            })

            total_temp.push(rslt[i].subtotal_tmp);
        }

        let sum_temp = total_temp.reduce((a, b) => a + b, 0)
        
        const detailtrx = await new Detailtrx({
            kode_detail_trx : generateKode, 
            trx_produk : produk_tmp,
            total_trx : sum_temp
        })
        
        await detailtrx.save()
        .then( async (result) => {
            await Detailtrxtemp.deleteMany({
                kode_key_temp : req.body.kode_key_temp
                })
                .then( r => {
                    res.send({result, msg : 'detail temp deleted, detail trx save new data'})
                })
                .catch( err => {
                    res.status(500).send({
                        message : err.message || "some error while retreiving transaction detail temporary data."
                    })
            });
        })
        .catch( err => {
            res.status(409).send({
                message : "msg error :" + err.message || "some error while create new transaction detail data.",
            })
        })

    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction detail data."
        })
    });
    
}

exports.show = async (req, res) => {
    await Detailtrx.findOne({
        _id : req.body.id
    })
    .then( result => {
        res.send(result)
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction detail data."
        })
    });
}

exports.delete = async (req, res) => {

    await Detailtrx.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        await Detailtrx.deleteOne({
        _id : result.id
        })
        .then( r => {
            res.send({r, msg : 'data berhasil dihapus'})
        })
        .catch( err => {
            res.status(500).send({
                message : err.message || "some error while retreiving transaction detail data."
            })
        });
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction detail data."
        })
    });

    
}

exports.update = async (req, res) => {

    await Detailtrx.findOne({
        _id : req.body.id
    })
    .then( async (result) => {

        await Detailtrxtemp.find({
            kode_key_temp : req.body.kode_key_temp
        })
        .populate({path: 'produk', select:['kode_produk','nama_produk'] })
        .then( async (rslt) => {
            // res.status(200).send(rslt)
    
            let produk_tmp = [];
            let total_temp = [];
            for (let i = 0; i < rslt.length; i++) {
                produk_tmp.push({
                    trx_kode : rslt[i].produk.kode_produk,
                    trx_nama : rslt[i].produk.nama_produk,
                    trx_harga : rslt[i].harga_tmp,
                    trx_jumlah : rslt[i].jumlah_tmp,
                    trx_subtotal : rslt[i].subtotal_tmp,
                });

                await Product.updateOne({_id : rslt[i].produk.id}, { 
                    $set : {
                        harga_baru : rslt[i].harga_tmp,
                        harga_lama : rslt[i].produk.harga_baru,
                        stok_baru : rslt[i].produk.stok_baru + rslt[i].jumlah_tmp,
                        stok_lama : rslt[i].produk.stok_baru,
                    }
                } )
                .then( r => {
                    res.status(200).send({data: r, message : "data berhasil diupdate"})
                })
    
                total_temp.push(rslt[i].subtotal_tmp);
            }
            
    
            let sum_temp = total_temp.reduce((a, b) => a + b, 0)
      
            await Detailtrx.updateOne({_id : result.id}, { 
                $set : {
                    trx_produk : produk_tmp,
                    total_trx : sum_temp
                }
            } )
            .then( r => {
                res.status(200).send({message : "data berhasil diupdate"})
            })
            .catch( error => {
                res.status(409).send({
                    message : "msg error :" + error.message || "some error while create new transaction detail data.",
                })
            })
            
    
        })
        .catch( err => {
            res.status(500).send({
                message : err.message || "some error while retreiving transaction detail data."
            })
        });
        
        
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving transaction detail data."
        })
    });

    
}
