// require mongoose
var mongoose = require('mongoose');

var enduserschema = mongoose.Schema({
  // storing the data according to considering the single user
  key: {
    type: String,
    required: true
  },
  // user registered data will be stored in this values and for single user number of forms can in stored here
  datavalues: [{
    type: String,
    required: true
  }]
});

var userformregdata = module.exports = mongoose.model('userformregdata', enduserschema);

// finding the form available or not
module.exports.findformdataisregisteredornot = function(data, callback) {
  userformregdata.findOne({key : data.key}, callback);
}

// creating registered data  in  to the table
module.exports.createenduserData = function(data, callback) {
  userformregdata.create(data, callback);
}

// updating registered data  in  to the table
module.exports.updatedatatoexistingregform = function(data, callback) {
  var insertingdata = data.datavalues
  userformregdata.update({key: data.key}, {$addToSet: {datavalues: insertingdata}}, callback);
}
