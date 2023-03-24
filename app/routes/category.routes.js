module.exports = app => {
    const categories = require("../controllers/category.controller");
    const r = require("express").Router();
    

    // const upload = multer({storage: storage});
    

    r.post("/daftar", categories.findAll);
    r.post("/simpan", categories.create);
    r.post("/detail", categories.show);
    r.post("/update", categories.update);
    r.post("/hapus", categories.delete);

    app.use("/bengkel-api/api/kategori", r);
}