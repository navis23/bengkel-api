const db = require("../models")
const Category = db.categories;
const fs = require('fs');
const path = require("path")

exports.findAll = async (req, res) => {

    const currentPage = req.query.page || 1;
    const perPage = req.query.limit || 10;
    const search = req.query.search || '';

    let totalItems;

    await Category.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r

        return await Category.find({ nama_kategori : {$regex : search, $options : "i"}})
        .skip((parseInt(currentPage - 1) * perPage))
        .limit(parseInt(perPage))
        .sort({ kode_kategori : 1 })
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

    await Category.find()
    .then( result => {

        const lastKode = result.length == 0 || null ? 'KTG0000' : result[result.length - 1].kode_kategori

        const checkKode = result.length == 0 || null ? 'KTG0000' : lastKode


        let strings = checkKode.replace(/[0-9]/g, '');
            let digits = (parseInt(checkKode.replace(/[^0-9]/g, '')) + 1).toString();
            if(digits.length < 4)
                digits = ("000"+digits)	.slice(-4);
                generateKode = strings + digits;

    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });
    
    const category = await new Category({
        kode_kategori : generateKode,
        nama_kategori : req.body.nama_kategori,
    })

    await category.save()
    .then( result => {
        res.status(200).send({message : "data berhasil disimpan : " + result.id})
    })
    .catch( err => {
        res.status(409).send({
            message : "msg error :" + err.message || "some error while create new category data.",
        })
    })
}

exports.show = async (req, res) => {
    await Category.findOne({
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

    await Category.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        await Category.deleteOne({
        _id : result.id
        })
        .then( r => {
            res.send({r, msg : 'data berhasil dihapus'})
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

    await Category.findOne({
        _id : req.body.id
    })
    .then( async (result) => {

        await Category.updateOne({_id : result.id}, { 
            $set : {
                nama_kategori : req.body.nama_kategori ? req.body.nama_kategori : result.nama_kategori
            }
        } )
        .then( r => {
            res.status(200).send({message : "data berhasil diupdate"})
        })
        .catch( error => {
            res.status(409).send({
                message : "msg error :" + error.message || "some error while create new category data.",
            })
        })
        
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });

    
}