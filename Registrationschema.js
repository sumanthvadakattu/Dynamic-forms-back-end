// require mongoose for database data actions
var mongoose = require('mongoose');

// defining the registartion schema
var registrationdata = mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  gmail: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  birthday: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  mobilenumber: {
    type: String,
    required: true
  },
  nation: {
    type: String,
    required: true
  }
});

// compiling schema into the model
var registerdata  = module.exports = mongoose.model('registerdata', registrationdata);

// checking the gmail that to decrese the duplication of the data
module.exports.gmailcheck = function(data, callback) {
	registerdata.find({gmail : data.gmail}, callback);
};

// inserting the data into database registrationdata
module.exports.register = function(data, callback) {
  registerdata.create(data, callback);
};

// checking the login credentials are available or not
module.exports.logincredentials = function(data, callback) {
	registerdata.findOne({gmail : data.gmail, password : data.password}, callback);
};

//  checkig the data for the username
