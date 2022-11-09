var express = require('express');
var router = express.Router();

/* GET about page. */
const theController = require('../controllers/aboutController');
router.get('/', theController.sendHTMLfile);

module.exports = router;
