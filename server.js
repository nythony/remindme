
const express = require('express');

const bodyParser = require ('body-parser');

var app = express();

const port = process.env.PORT || 3000;//Dyanmic Port

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(__dirname + '/public/views'));

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


//////////////
// Database //
//////////////

const { Client } = require('pg');

const client = new Client({
  //connectionString: process.env.DATABASE_URL,
  connectionString: "postgres://yfnxgdisandwxx:4ecc65c52fdbdf08453dc7408d4e5f0de62ca2f45198e3dc39fb7b1d679be9bb@ec2-54-83-33-14.compute-1.amazonaws.com:5432/d91im41e0dhs7q",
  ssl: true,
});
client.connect();

// client.query('SELECT * FROM Test', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });


app.get('/',(req,res)=>{
    res.render('home.html');
});

//Registering a phone number
app.get('/login',(req,res)=>{
    res.render('login.html');
});




app.post('/sms', function(req, res) {
  var num = Number.parseInt(req.body.From, 10);
  var content = req.body.Body;

  console.log ("num = " + num + " and content is = " + content);

  if (content == 'OK'){
    var promise1 = new Promise(function(resolve, reject) {
    
      client.query("SELECT * FROM RegNum WHERE phonenum = " + num + ";", (error, results) => {
          console.log("here first");
          // if (error){
          //   console.log(error);
          // }
          
          // else{
            for (let row of results.rows) { //Only one record
              //The client has already registered this phone number
              console.log("num should be " + row["phonenum"] + " and pass is " + row["pass"]);
              if (row["phonenum"] == num && row["pass"] == null) {
                var twilio = require('twilio');
                var twiml = new twilio.twiml.MessagingResponse();
                twiml.message('You have already registered your number. Please go to /accountSetup to register a password');
                res.writeHead(200, {'Content-Type': 'text/xml'});
                res.end(twiml.toString());
                
                resolve("No");
              }

              else{
                var twilio = require('twilio');
                var twiml = new twilio.twiml.MessagingResponse();
                twiml.message('Your number has been successfully registered with RemindMe!');
                res.writeHead(200, {'Content-Type': 'text/xml'});
                res.end(twiml.toString());
                console.log("here second");
                resolve(num);
              }

          //}

        }

      });
    })
  }
  
  else{
      var promise1 = new Promise(function(resolve, reject) {
        var twilio = require('twilio');
        var twiml = new twilio.twiml.MessagingResponse();
        twiml.message('You declined to register to RemindMe.');
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
        resolve("No");
    });

  }

  promise1.then(function(value) {
    if (value == "No"){
        console.log('Rejected Registration');
    }
    else{
        if (value == '+18572720759' || value == '+17816020871' || value == '+18608076016' || value == '+16504306882'){
          var num = Number.parseInt(value, 10);

          console.log("Num to add to DB: " + num);
        
          client.query('INSERT INTO RegNum(phonenum) VALUES(\'' + num + '\');', (err, res) => {
            if (err) throw err;
            for (let row of res.rows) {
              console.log('NEW NUMBER REGISTERED');
            }
            client.end();
          });

        }

      else{
        console.log("Use a team member's phone number");
      }
    }

  });

});



app.get('/createPass',(req,res)=>{
    res.render('createPass.html');
});




app.post('/fail', function(req, res) {
  console.log("Failed");
  res.redirect('/');
});

/*    
app.post('/registered', function(req, res) {

    var num = req.body.num;
    var pass = req.body.pass;

//cannot post under a post
    app.post('/sms', function(req, res) {
      var twilio = require('twilio');
      var twiml = new twilio.TwimlResponse();
      twiml.message('The Robots are coming! Head for the hills!');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());


      //do query call here
    });

    //wait for x amount of minutes


    if (num == '8572720759' || num == '7816020871' || num == '8608076016' || num == '6504306882'){
      
        client.query('INSERT INTO RegNum(phonenum, pass) VALUES(\'' + num + '\', \''pass + '\');', (err, res) => {
          if (err) throw err;
          for (let row of res.rows) {
            console.log('NEW NUMBER REGISTERED');
          }
          client.end();
        });

      }
    else{
      console.log("Use a team member's phone number");
      res.redirect('/');
    }
});
*/





//Sending messages
app.get('/message',(req,res)=>{
    res.render('message.html');
});

app.post('/submitted', function(req, res) {

    var msg = req.body.msg;
    var num = req.body.num;

    if (num == '8572720759' || num == '7816020871' || num == '8608076016' || num == '6504306882'){
      console.log(msg, num);

      const accountSid = 'ACc5a568508001a6ed52d2f422adfee095';
      const authToken = '77f047ecf095d17afc433a0dfd08db99';
      const twil = require('twilio')(accountSid, authToken);
      twil.messages
        .create({
           body: msg,
           from: '12014823454',
           to: '+1' + num,
         })
        .then(res.redirect('/')); //message => console.log(message.status));
      }
    else{
      console.log("Use a team member's phone number");
      res.redirect('/');
    }
});


app.get('/about',(req,res)=>{
    res.render('about.html');
});

app.get('/contact',(req,res)=>{
    res.render('contact.html');
});


app.get('/sign_up_page',(req,res)=>{
    res.render('sign_up_page.html');
});


//Register a phone number.
app.get('/register',(req,res)=>{
    res.render('register.html');
});


app.post('/sendVerification', function(req, res) {

    var num = req.body.num;

    if (num == '8572720759' || num == '7816020871' || num == '8608076016' || num == '6504306882'){
      console.log(num);

      const accountSid = 'AC8585ffe45f82349c213ec86fcef36696';
      const authToken = '38cb619ed64c90a5a4a116ac21032885';
      const twil = require('twilio')(accountSid, authToken);
      twil.messages
        .create({
           body: "In order to register your phone number, please send 'OK' and wait for a response.",
           from: '+12017012807',
           to: '+1' + num,
         })
        .then(res.redirect('/accountsetup_simple')); //accountSetup.html will set up password (NEED A app.get)
      }
    else{
      console.log("Use a team member's phone number");
      res.redirect('/');
    }
});

app.get('/accountsetup_simple',(req,res)=>{
    res.render('accountsetup_simple.html');
});


//needs verification
// app.post('/regpass', function(req, res) {

//     var num = req.body.num;

//     if (num == '8572720759' || num == '7816020871' || num == '8608076016' || num == '6504306882'){
//       console.log(num);

//       const accountSid = 'AC8585ffe45f82349c213ec86fcef36696';
//       const authToken = '38cb619ed64c90a5a4a116ac21032885';
//       const twil = require('twilio')(accountSid, authToken);
//       twil.messages
//         .create({
//            body: "In order to register your phone number, please send 'OK' and wait for a response.",
//            from: '+12017012807',
//            to: '+1' + num,
//          })
//         .then(res.redirect('/accountsetup_simple')); //accountSetup.html will set up password (NEED A app.get)
//       }
//     else{
//       console.log("Use a team member's phone number");
//       res.redirect('/');
//     }
// });


app.get('/log_in_page',(req,res)=>{
    res.render('log_in_page.html');
});

app.get('/dashboard',(req,res)=>{
    res.render('dashboard.html');
});

app.get('/create_new_reminder',(req,res)=>{
    res.render('create_new_reminder.html');
});


app.listen(port,()=>{
    console.log(`Server is up on Port:${port}`);
}); //DYNAMIC PORT 