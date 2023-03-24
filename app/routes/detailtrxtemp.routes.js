module.exports = app => {
    const detailtrxtemps = require("../controllers/detailtrxtemp.controller");
    const r = require("express").Router();
    

    // const upload = multer({storage: storage});
    

    r.post("/daftar", detailtrxtemps.findAll);
    r.post("/simpan", detailtrxtemps.create);
    r.post("/update", detailtrxtemps.update);
    r.post("/hapus", detailtrxtemps.delete);
    r.post("/hapusall", detailtrxtemps.deleteAllByKey);

    app.use("/bengkel-api/api/detailtrxtemp", r);
}