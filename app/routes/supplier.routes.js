module.exports = app => {
    const suppliers = require("../controllers/supplier.controller");
    const r = require("express").Router();
    

    // const upload = multer({storage: storage});
    

    r.post("/daftar", suppliers.findAll);
    r.post("/simpan", suppliers.create);
    r.post("/detail", suppliers.show);
    r.post("/update", suppliers.update);
    r.post("/hapus", suppliers.delete);

    app.use("/bengkel-api/api/supplier", r);
}