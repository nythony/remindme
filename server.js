
const express = require('express');

const bodyParser = require ('body-parser');

var app = express();

const port = process.env.PORT || 3000;//Dyanmic Port

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/public/views'));

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// const accountSid = 'ACf73156c3674a1e76ea44411d91bd4abb';
// const authToken = '0a26aff0ef5fbd3b94deb0f39a90ac79';
// const twil = require('twilio')(accountSid, authToken);
// twil.messages
//   .create({
//      body: 'This is from server.js',
//      from: '+12568889318',
//      to: '+16504306882'
//    })
//   .then(message => console.log(message.status))


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

client.query('SELECT * FROM Test', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});


app.get('/',(req,res)=>{
    res.render('home.html');
});

app.get('/login',(req,res)=>{
    res.render('login.html');
});


                    app.get('/registration',(req,res)=>{
                        res.render('registration.hbs',{pageTitle:'Registration Page',}); 
                    });

app.get('/message',(req,res)=>{
    res.render('message.html');
    res.redirect('/login');
});

app.post('/submitted', function(req, res) {
    var msg = req.body.msg;
    console.log(msg);
    const accountSid = 'ACc5a568508001a6ed52d2f422adfee095';
    const authToken = '77f047ecf095d17afc433a0dfd08db99';
    const twil = require('twilio')(accountSid, authToken);
    twil.messages
      .create({
         body: msg,
         from: '+12014823454',
         to: '+17816020871',
       })
      .then(message => console.log(message.status));
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