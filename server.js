
const express = require('express');

const bodyParser = require ('body-parser');

var app = express();

const port = process.env.PORT || 3000;//Dyanmic Port

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/public/views'));

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);


app.set('view engine', 'html');

app.get('/',(req,res)=>{
    //res.send('<h1>Hello express</h1>');
    res.render('home.html');
});

app.get('/login',(req,res)=>{
    res.render('login.html');
});


                    app.get('/registration',(req,res)=>{
                        res.render('registration.hbs',{pageTitle:'Registration Page',}); 
                    });

                    app.post('/submitted', function(req, res) {
                       //function: does it exist in server -> true (ouput red stuff); false (print exists)
                        //var username = req.body.username;
                        console.log(req.body.username);
                        console.log(req.body.password);
                        console.log(req.body.newusername);
                        console.log(req.body.newpassword);
                        console.log(req.body.newphone);
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