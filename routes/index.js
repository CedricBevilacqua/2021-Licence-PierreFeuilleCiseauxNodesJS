var express = require('express');
var router = express.Router();

/* GET index page. */
const theController = require('../controllers/indexController');
router.get('/', theController.sendHTMLfile);

module.exports = router;
