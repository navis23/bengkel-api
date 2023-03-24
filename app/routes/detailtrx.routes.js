module.exports = app => {
    const detailtrxs = require("../controllers/detailtrx.controller");
    const r = require("express").Router();
    

    // const upload = multer({storage: storage});
    

    r.post("/daftar", detailtrxs.findAll);
    r.post("/simpan", detailtrxs.create);
    r.post("/detail", detailtrxs.show);
    r.post("/update", detailtrxs.update);
    r.post("/hapus", detailtrxs.delete);

    app.use("/bengkel-api/api/detailtrx", r);
}