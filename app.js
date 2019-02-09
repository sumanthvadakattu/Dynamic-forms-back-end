var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// ***** user defined code *****

// require fs for enabling file operations
var fs = require('file-system');

// require nodemailer for sending mail
var nodemailer = require('nodemailer');

// require mongoose for using mongodb
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/finalprodatabase';

// creating an instance of the registration schema
var registermodule = require('./Registrationschema');
var dynamicregistrationmodule = require('./dynamicRegistrationSchemaDescription');
var datastoremodule = require('./formdatastoring');

// *****************************

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// ***** user defined code *****

function accessControl(request, response) {
  console.log('!OPTIONS');
  var headers = {};
  // IE8 does not allow domains to be specified, just the *
  // headers["Access-Control-Allow-Origin"] = req.headers.origin;
  headers["Access-Control-Allow-Origin"] = "*";
  headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
  headers["Access-Control-Allow-Credentials"] = false;
  headers["Access-Control-Max-Age"] = '86400'; // 24 hours
  headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
  response.writeHead(200, headers);
  response.end();
}

// mongo database connection
mongoose.connect(url , function(error , db) {
  if(error) {
    console.log("database not created" + "\n" + error);
  }
  else {
    console.log("database created");
  }
});

// node mailer used to send mail to other users
var mailcredentials = nodemailer.createTransport({
  service : 'gmail',
  auth : {
    user : 'projectfinal201718@gmail.com',
    pass : 'projectfinal@123'
  }
});
// var maildata = {
//   from : 'projectfinal201718@gmail.com',
//   to : 'gurusainath007@gmail.com',
//   subject : 'This message from google forms replication',
//   text : 'hi hello you are welcome'
// };
// mailcredentials.sendMail(maildata , function(error , info) {
//   if(error){
//         console.log(error);
//         // res.send('error');
//     }else{
//         console.log('Message sent: ' + info.response);
//         // res.send('sent');form
//     };
// });

// registration for every user
app.use('/registration', function(request, response) {
  var maindata= {
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    gmail: request.body.gmail,
    password: request.body.password,
    birthday: request.body.birthday,
    gender: request.body.gender,
    mobilenumber: request.body.mobilenumber,
    nation: request.body.nation
  }
  var gmailvalidation = {
    gmail: maindata.gmail,
  }
  registermodule.gmailcheck(gmailvalidation, function(error, data) {
    if (data[0]) {
      error="You already registered";
      response.send(error);
    } else {
      registermodule.register(maindata, function(error, data) {
        if(data) {
          var success = 'success'
          response.send(success);
        }
        else {
          var error = 'error'
          response.send(error);
        }
      });
    }
  });
});

// login for every user
app.use('/login', function(request, response) {
  var logindata= {
    gmail: request.body.gmail,
    password: request.body.password
  }
  console.log(logindata);
  console.log(logindata.gmail + " " + logindata.password);
  registermodule.logincredentials(logindata, function(error, data) {
    if(data) {
      var success = 'success';
      response.send(success);
    }
    else {
      var error = 'error';
      response.send(error);
    }
  });
});

var customvariable = 'onedata';
// formname checking in the database
app.use('/formcheckdata', function(request, response) {
  if(request.method === 'OPTIONS') {
    accessControl(request, response);
  }
  else {
    var maindataset = {
      formname: request.body.formname,
      username: request.body.username
    }
    dynamicregistrationmodule.findformnamedata(maindataset, function(error, data) {
      if(data) {
        if(data.values[0].formName == maindataset.formname) {
          var error = 'error';
          response.send(error);
        }
        else {
          var success = 'success';
          response.send(success);
        }
      }
      else {
        var chaos="notFind";
        response.send(chaos);
        customvariable = 'twodata';
      }
    });
  }
});

// creating the form and generate the basic requirements in USERFORM and userformdataobject
app.use('/formgenerateddata', function(request, response) {
  if(request.method === 'OPTIONS') {
    accessControl(request, response);
  }
  else {
    var maindataset = request.body;
    var userformrequirements = {
      key: maindataset.key,
      values: [{
        creatorName: maindataset.values[0].creatorName,
        formName: maindataset.values[0].formName,
        formDescription: maindataset.values[0].formDescription,
        formgeneratedDate: maindataset.values[0].formgeneratedDate,
        formgeneratedData: [{
          _id: maindataset.values[0].formName,
          text: [{
            _id: JSON.stringify(maindataset.values[0].formgeneratedData[0].text)
          }],
          textarea: [{
            _id: JSON.stringify(maindataset.values[0].formgeneratedData[0].textarea)
          }],
          button: [{
            _id: JSON.stringify(maindataset.values[0].formgeneratedData[0].button)
          }],
          checkbox: [{
            _id: JSON.stringify(maindataset.values[0].formgeneratedData[0].checkbox)
          }],
          select: [{
            _id: JSON.stringify(maindataset.values[0].formgeneratedData[0].select)
          }]
        }]
      }]
    }
    console.log(customvariable);
    if(customvariable === 'twodata') {
      dynamicregistrationmodule.createData(userformrequirements, function(error, data) {
        if(data) {
          var datas = "success"
          response.send(datas);
        }
        else {
          var datas = 'error';
          response.send(datas + ' ' + error);
        }
      });
      customvariable = 'onedata';
    }
    else {
      // response.send(userformrequirements);
      dynamicregistrationmodule.findandaddusernamedata(userformrequirements, function(error, data) {
        if(data) {
          var mainsetoutputdata = {
            key: userformrequirements.key,
            mainsetdata: userformrequirements.values
          }
          dynamicregistrationmodule.updatedatatoexistinguser(mainsetoutputdata, function(error, data){
            if(data) {
              var chaos="entered";
              response.send(chaos);
            }
            else {
              var chaos="not entered";
              response.send(chaos);
            }
          });
        }
        else {
          var chaos="not found";
          response.send(chaos);
        }
      });
    }
  }
});

app.use('/formgenerateddataoutput', function(request, response) {
  if(request.method === 'OPTIONS') {
    accessControl(request, response);
  }
  else {
    var maindataset = {
      key: request.body.name,
      formname: request.body.form
    }
    var flag = false;
    dynamicregistrationmodule.findandaddusernamedata(maindataset, function(error, data) {
      var length = data.values.length;
      for(var i=0; i<length; i=i+1) {
        if(maindataset.formname == data.values[i].formName) {
          var datas = data;
          var outputdatas = {
            key: datas.key,
            values: [{
              creatorName: datas.values[i].creatorName,
              formName: datas.values[i].formName,
              formDescription: datas.values[i].formDescription,
              formgeneratedDate: datas.values[i].formgeneratedDate,
              formgeneratedData: [{
                _id: datas.values[i].formName,
                text: [{
                  _id: JSON.parse(datas.values[i].formgeneratedData[0].text[0]._id)
                }],
                textarea: [{
                  _id: JSON.parse(datas.values[i].formgeneratedData[0].textarea[0]._id)
                }],
                button: [{
                  _id: JSON.parse(datas.values[i].formgeneratedData[0].button[0]._id)
                }],
                checkbox: [{
                  _id: JSON.parse(datas.values[i].formgeneratedData[0].checkbox[0]._id)
                }],
                select: [{
                  _id: JSON.parse(datas.values[i].formgeneratedData[0].select[0]._id)
                }]
              }]
            }]
          }
          var finaloutput = outputdatas.values[0]
        }
      }
      response.send(finaloutput);
    });
  }
});

app.use('/datafromenduser', function(request, response) {
  if(request.method === 'OPTIONS') {
    accessControl(request, response);
  }
  else {
    var endusermaindata = request.body;
    var mainstringdata = {
      key: endusermaindata.username+''+endusermaindata.formname
    }
    datastoremodule.findformdataisregisteredornot(mainstringdata, function(error, data) {
      if(data) {
        var maintheme = {
          key: mainstringdata.key,
          datavalues: JSON.stringify(endusermaindata.data[0])
        }
        datastoremodule.updatedatatoexistingregform(maintheme, function(error, data) {
          if(data) {
            var datas = "success"
            response.send(datas);
          }
          else {
            var datas = "error"
            response.send(datas);
          }
        });
      }
      else {
        var maintheme = {
          key: mainstringdata.key,
          datavalues: JSON.stringify(endusermaindata.data[0])
        }
        datastoremodule.createenduserData(maintheme, function(error, data) {
          if(data) {
            var datas = "success"
            response.send(datas);
          }
          else {
            var datas = "error"
            response.send(datas);
          }
        });
      }
    });
  }
});

//  getting the data how many responses are came and retriving the data
app.use('/alltheresponses', function(request, response) {
  if(request.method === 'OPTIONS') {
    accessControl(request, response);
  }
  else {
    var endusermaindata = request.body;
    var mainstringdata = {
      key: endusermaindata.name+''+endusermaindata.form
    }
    datastoremodule.findformdataisregisteredornot(mainstringdata, function(error, data) {
      if(data) {
        var length = data.datavalues.length;
        var mainarray = [];
        for(var i = 0; i < length; i = i + 1) {
          var datas = data;
          mainarray.push(JSON.parse(datas.datavalues[i]));
        }
        var maindatasetoutput = {
          key: datas.key,
          datavalues: mainarray
        }
        response.send(data)
      }
      else {
        var error = 'error'
        response.send(error)
      }
    });
  }
});

// data getting form here is to build the home page
app.use('/gettingtheusername', function(request, response) {
  var gmailvalidation = {
    gmail: request.body.gmail,
  }
  registermodule.gmailcheck(gmailvalidation, function(error, data) {
    if (data) {
      response.send(data)
    }
    else {
      var error = 'error'
      response.send(error)
    }
  });
});

app.use('/gettingtheformdata', function(request, response) {
  var gettingnamedata = {
    key: request.body.key,
  }
  dynamicregistrationmodule.findandaddusernamedata(gettingnamedata, function(error, data) {
    if (data) {
      response.send(data)
    }
    else {
      var error = 'error'
      response.send(error)
    }
  });
});
// *****************************

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
