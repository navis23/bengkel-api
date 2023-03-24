const db = require("../models")
const Supplier = db.suppliers;
const fs = require('fs');
const path = require("path")

exports.findAll = async (req, res) => {

    const currentPage = req.query.page || 1;
    const perPage = req.query.limit || 10;
    const search = req.query.search || '';

    let totalItems;

    await Supplier.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r

        return await Supplier.find({ nama_supplier : {$regex : search, $options : "i"}})
        .skip((parseInt(currentPage - 1) * perPage))
        .limit(parseInt(perPage))
        .sort({ kode_supplier : 1 })
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
            message : err.message || "some error while retreiving supplier data."
        })
    });
}

exports.create = async (req, res) => {
    // console.log('test array terakhir' + JSON.stringify(testingo.value))
    let generateKode = ''

    await Supplier.find()
    .then( result => {

        const lastKode = result.length == 0 || null ? 'SPL0000' : result[result.length - 1].kode_supplier

        const checkKode = result.length == 0 || null ? 'SPL0000' : lastKode


        let strings = checkKode.replace(/[0-9]/g, '');
            let digits = (parseInt(checkKode.replace(/[^0-9]/g, '')) + 1).toString();
            if(digits.length < 4)
                digits = ("000"+digits)	.slice(-4);
                generateKode = strings + digits;

    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving supplier data."
        })
    });
    
    const supplier = await new Supplier({
        kode_supplier : generateKode,
        nama_supplier : req.body.nama_supplier,
        nomor_supplier : req.body.nomor_supplier,
        alamat_supplier : req.body.alamat_supplier,
    })

    await supplier.save()
    .then( result => {
        res.status(200).send({message : "data berhasil disimpan : " + result.id})
    })
    .catch( err => {
        res.status(409).send({
            message : "msg error :" + err.message || "some error while create new supplier data.",
        })
    })
}

exports.show = async (req, res) => {
    await Supplier.findOne({
        _id : req.body.id
    })
    .then( result => {
        res.send(result)
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving supplier data."
        })
    });
}

exports.delete = async (req, res) => {

    await Supplier.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        await Supplier.deleteOne({
        _id : result.id
        })
        .then( r => {
            res.send({r, msg : 'data berhasil dihapus'})
        })
        .catch( err => {
            res.status(500).send({
                message : err.message || "some error while retreiving supplier data."
            })
        });
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving supplier data."
        })
    });
}

exports.update = async (req, res) => {

    await Supplier.findOne({
        _id : req.body.id
    })
    .then( async (result) => {

        await Supplier.updateOne({_id : result.id}, { 
            $set : {
                nama_supplier : req.body.nama_supplier ? req.body.nama_supplier : result.nama_supplier,
                nomor_supplier : req.body.nomor_supplier ? req.body.nomor_supplier : result.nomor_supplier,
                alamat_supplier : req.body.alamat_supplier ? req.body.alamat_supplier : result.alamat_supplier,
            }
        } )
        .then( r => {
            res.status(200).send({message : "data berhasil diupdate"})
        })
        .catch( error => {
            res.status(409).send({
                message : "msg error :" + error.message || "some error while create new supplier data.",
            })
        })
        
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving supplier data."
        })
    });

    
}