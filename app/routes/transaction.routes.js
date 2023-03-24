module.exports = app => {
    const transactions = require("../controllers/transaction.controller");
    const r = require("express").Router();
    

    // const upload = multer({storage: storage});
    

    r.post("/daftar", transactions.findAll);
    r.post("/simpan", transactions.create);
    r.post("/detail", transactions.show);
    r.post("/update", transactions.update);
    r.post("/hapus", transactions.delete);
    r.post("/all", transactions.allData);

    app.use("/bengkel-api/api/transaksi", r);
}