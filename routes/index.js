var router = require("express").Router();
var crypto_mod = require("crypto");
var user_cls = require("../models/user.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: '主页',
    user: req.session.user,
    error: req.flash("error").toString(),
    success: req.flash("success").toString()
  });
});

router.get('/reg', function(req, res, next) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    error: req.flash("error").toString(),
    success: req.flash("success").toString()
  });
});

router.post('/reg', function (req, res) {
  var name = req.body["name"];
  var passwd = req.body["password"];
  var passwd_re = req.body["password-repehttp://localhost:3000/at"];

  if (passwd != passwd_re) {
    req.flash("error", "密码不一致");
    return res.redirect("/reg");
  }

  var md5 = crypto_mod.createHash("md5")
  var password = md5.update(req.body.password).digest("hex");

  var user_new = new user_cls({
      name: name,
      password: password,
      email: req.body.email
  });

  user_cls.get(user_new.name, function (err, user) {
    if (err) {
      req.flash("error", err);
      return res.redirect("/");
    }

    if (user) {
      req.flash("error", "用户已存在!");
      return res.redirect("/reg");
    }

    user_new.save(function (err, user) {
      if (err) {
        req.flash("error", err);
        return res.redirect("/reg");
      }

      req.session.user = user_new;
      req.flash("success", "注册成功!")
      res.redirect("/");
    });
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'login',
    user: req.session.user,
    error: req.flash("error").toString(),
    success: req.flash("success").toString()
  });
});

router.post('/login', function(req, res) {
  //生成密码的 md5 值
  var md5 = crypto_mod.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  user_cls.get(req.body.name, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在!');
      return res.redirect('/login');//用户不存在则跳转到登录页
    }
    //检查密码是否一致
    if (user.passwd != password) {
      req.flash('error', '密码错误!');
      return res.redirect('/login');//密码错误则跳转到登录页
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    req.flash('success', '登陆成功!');
    res.redirect('/');//登陆成功后跳转到主页
  });
});

router.get('/post', function(req, res, next) {
  res.render('post', { title: 'post' });
});

router.post('/post', function(req, res, next) {

});

router.get('/logout', function(req, res) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');//登出成功后跳转到主页
});

module.exports = router;
