
const express = require('express');

const bodyParser = require ('body-parser');

var app = express();

const port = process.env.PORT || 3000;//Dyanmic Port

app.use(bodyParser.urlencoded({ extended: true }));
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
  console.log("We are getting here");

  var promise1 = new Promise(function(resolve, reject) {
    var twilio = require('twilio');
    var twiml = new twilio.twiml.MessagingResponse();
    twiml.message('The Robots are coming! Head for the hills!');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
    resolve(twiml.toString());
  });

  promise1.then(function(value) {
    console.log(value);
    // expected output: "foo"
  });


});





app.post('/fail', function(req, res) {
  console.log("Failed");
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

      const accountSid = 'AC8585ffe45f82349c213ec86fcef36696';
      const authToken = '38cb619ed64c90a5a4a116ac21032885';
      const twil = require('twilio')(accountSid, authToken);
      twil.messages
        .create({
           body: msg,
           from: '+12017012807',
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


app.listen(port,()=>{
    console.log(`Server is up on Port:${port}`);
}); //DYNAMIC PORT 