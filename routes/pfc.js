var express = require('express');
var router = express.Router();

/* GET about page. */
const theController = require('../controllers/pfcController');
router.get('/', theController.sendHTMLfile);

module.exports = router;
