var blog_db = require("./db");

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

User.prototype.save = function (callback) {
  var user = {
    name: this.name,
    passwd: this.password,
    email: this.email
  };

  blog_db.open(function (err, db) {
    if (err) {
      return callback(err);
    }

    db.collection("users", function (err, collection) {
      if (err) {
        blog_db.close();
        return callback(err);
      }

      collection.insert(user, {safe: true}, function (err, user) {
        blog_db.close();
        if (err) {
          return callback(err);
        }
        callback(null, user[0]);
      });
    });
  });
};

User.get = function (name, callback) {
  blog_db.open(function (err, db) {
    if (err) {
      return callback(err);
    }

    db.collection("users", function (err, collection) {
      if (err) {
        blog_db.close();
        return callback(err);
      }

      collection.findOne({name: name}, function (err, user) {
        blog_db.close();
        if (err) {
          return callback(err);
        }
        callback(null, user);
      });
    });
  });
};
