// require mongoose
var mongoose = require('mongoose');

var descriptionschema = mongoose.Schema({
  // storing the data according to considering the single user
  key: {
    type: String,
    required: true
  },
  // user form data will be stored in this values and for single user number of forms can in stored here
  values:[{
    // user / creator name
    creatorName: {
      type: String,
      required: true
    },
    // form name
    formName: {
      type: String,
      required: true
    },
    // form description
    formDescription: {
      type: String,
      required: true
    },
    // form generating date
    formgeneratedDate: {
      type: String,
      required: true
    },
    // creating of a form data
    formgeneratedData: [{
      _id: {
        type: String,
        required: true
      },
      text: [{
        _id: {
          type: String
        }
      }],
      textarea: [{
        _id: {
          type: String
        }
      }],
      button: [{
        _id: {
          type: String
        }
      }],
      checkbox: [{
        _id: {
          type: String
        }
      }],
      select: [{
        _id: {
          type: String
        }
      }]
    }]
  }]
});

var descriptionmodel = module.exports = mongoose.model('descriptionmodel', descriptionschema);

// updating/creating description data in  to the table
module.exports.createData = function(data, callback) {
  descriptionmodel.create(data, callback);
}

//finding formname already exists or not
module.exports.findformnamedata = function(data, callback) {
  descriptionmodel.findOne({key : data.username}, callback);
}
module.exports.updatedatatoexistinguser = function(data, callback) {
  var insertiondata = data.mainsetdata[0];
  descriptionmodel.update({key: data.key}, {$addToSet: {values: insertiondata}}, callback);
}

// updating a table information for already existed user createdatauser
module.exports.findandaddusernamedata = function(data, callback) {
  descriptionmodel.findOne({key : data.key}, callback);
}
