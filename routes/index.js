var express = require('express');
var router = express.Router();

const seller = require('../controllers').seller;
const customers = require('../controllers').customer;


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'ACIK' });
// });


/* seller router*/
router.post('/create', seller.create); 
router.post('/sell' , seller.sell);
router.post('/unsell', seller.unsell);
router.delete('/product/:productId' , seller.delete);
router.get('/sellable', seller.sellable);
router.get('/out-of-stock', seller.out_of_stock);
router.get('/top-n-sold/:count' , seller.top_n_sold)

/* Customer routers*/
router.post('/place-order'  ,customers.place_order ); 


module.exports = router;
