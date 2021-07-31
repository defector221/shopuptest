var express  = require('express');
var router   = express.Router();
const cors   = require("cors");
var SecurityMiddleware = require('../Middleware/SecurityMiddleware');

var APIController = require('./APIController');

router.use(cors());
router.use(SecurityMiddleware);

/* GET */
router.get('/', async function (req, res, next) {
  res.json({
    message:"API Serer is up and healthy for transaction"
  });
});

router.use('/api/v1', APIController);

module.exports = router;
