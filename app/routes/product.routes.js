module.exports = app => {
    const products = require("../controllers/product.controller");
    const r = require("express").Router();
    

    // const upload = multer({storage: storage});
    

    r.post("/daftar", products.findAll);
    r.post("/simpan", products.create);
    r.post("/detail", products.show);
    r.post("/update", products.update);
    r.post("/hapus", products.delete);
    r.post("/dashboard", products.dashboard);

    app.use("/bengkel-api/api/produk", r);
}