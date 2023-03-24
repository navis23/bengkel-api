const express = require('express')
const cors = require('cors')
const db = require("./app/models")
const multer = require("multer")
const path = require("path")

const app = express();
const port = 8000;

// logic upload file

const storageKategori = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "./app/uploads")
    },
    filename: function (req, file, cb) {
        // console.log(file)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upKtgr = multer({storage: storageKategori}).single('foto')

//app use
const corsOptions = {
    origin : "*"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(upKtgr);
app.use('/app', express.static('app'));
// app.use(express.static('app'))


//db connect
db.mongoose.connect(db.url, {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => console.log('connected to database')
).catch(e => {
    console.log(`failed to connect db : ${e.message}`);
    process.exit()
});

// routes
require("./app/routes/category.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/supplier.routes")(app);
require("./app/routes/transaction.routes")(app);
require("./app/routes/detailtrx.routes")(app);
require("./app/routes/detailtrxtemp.routes")(app);


app.get('/', (req, res) => res.send('REady  for upok'))
app.listen(port, () => console.log(`Testing port ${port}!`))