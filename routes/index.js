var router = require("express").Router();
var crypto_mod = require("crypto");
var user_cls = require("../models/user.js");
var Post = require("../models/post.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.get(null, function (err, posts) {
    if (err) {
      posts = [];
    }
    res.render('index', {
      title: '主页',
      user: req.session.user,
      posts: posts,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get("/reg", checkNotLogin);
router.get('/reg', function(req, res, next) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    error: req.flash("error").toString(),
    success: req.flash("success").toString()
  });
});

router.post("/reg", checkNotLogin);
router.post('/reg', function (req, res) {
  var name = req.body["name"];
  var passwd = req.body["password"];
  var passwd_re = req.body["password-repeat"];

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

router.get("/login", checkNotLogin);
router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'login',
    user: req.session.user,
    error: req.flash("error").toString(),
    success: req.flash("success").toString()
  });
});

router.post("/login", checkNotLogin);
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

router.get("/post", checkLogin);
router.get('/post', function(req, res, next) {
  res.render('post', {
    title: '发表',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post("/post", checkLogin);
router.post('/post', function(req, res) {
  var currentUser = req.session.user,
      post = new Post(currentUser.name, req.body.title, req.body.post);
  post.save(function (err) {
  if (err) {
    req.flash('error', err);
    return res.redirect('/');
  }
  req.flash('success', '发布成功!');
  res.redirect('/');//发表成功跳转到主页
  });
});

router.get("/logout", checkLogin);
router.get('/logout', function(req, res) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');//登出成功后跳转到主页
});

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "未登录!");
    res.redirect("/login");
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash("error", "已登录!");
    req.redirect("back")
  }
  next();
}

module.exports = router;
