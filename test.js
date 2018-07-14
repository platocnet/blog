var person = {
  print : function() {
    console.log(this);
  }
};

var p = new person;

console.log(p.print());
