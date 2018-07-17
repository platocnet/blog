var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'home' });
});

router.get('/reg', function(req, res, next) {
  res.render('reg', { title: 'register' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});

router.post('/login', function(req, res, next) {

});

router.get('/post', function(req, res, next) {
  res.render('post', { title: 'post' });
});

router.post('/post', function(req, res, next) {

});

router.get('/logout', function(req, res, next) {
  
});

module.exports = router;
