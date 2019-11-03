
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

app.get('/login',(req,res)=>{
    res.render('login.html');
});


                    app.get('/registration',(req,res)=>{
                        res.render('registration.hbs',{pageTitle:'Registration Page',}); 
                    });

app.get('/message',(req,res)=>{
    res.render('message.html');
});

app.post('/submitted', function(req, res) {

    var msg = req.body.msg;
    var num = req.body.num;

    if (num == '8572720759' || num == '7816020871' || num == '8608076016' || num == '6504306882'){
      console.log(msg, num);

      const accountSid = 'ACf73156c3674a1e76ea44411d91bd4abb';
      const authToken = '0a26aff0ef5fbd3b94deb0f39a90ac79';
      const twil = require('twilio')(accountSid, authToken);
      twil.messages
        .create({
           body: msg,
           from: '+12568889318',
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