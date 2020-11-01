var express = require('express');
var router = express.Router();

const seller = require('../controllers').seller;
const customers = require('../controllers').customer;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ACIK' });
});


/* seller router*/
router.post('/create', seller.create); 
router.post('/sell' , seller.sell);
router.post('/unsell', seller.unsell);
router.delete('/product/:productId' , seller.delete);


/* Classroom Router */
// router.get('/api/create', classroomController.list);
// router.get('/api/classroom/:id', classroomController.getById);
// router.post('/api/classroom', classroomController.add);
// router.put('/api/classroom/:id', classroomController.update);
// router.delete('/api/classroom/:id', classroomController.delete);

// /* Student Router */
// router.get('/api/student', studentController.list);
// router.get('/api/student/:id', studentController.getById);
// router.post('/api/student', studentController.add);
// router.put('/api/student/:id', studentController.update);
// router.delete('/api/student/:id', studentController.delete);


module.exports = router;
