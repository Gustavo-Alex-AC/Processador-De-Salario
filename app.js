const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const date = require(__dirname + '/calculo.js');
const session = require('express-session');
const passport = require('passport');
const passportLocalmongoose = require('passport-local-mongoose');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: 'meu segredo.',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// database set up
mongoose.connect('mongodb://127.0.0.1:27017/salarioDB');
const salarioSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  salarioBruto:{
    type: Number,
    required: true
  },
  inss:{
    type: Number,
    required: true
  },
  irt:Number,
  faltas: Number,
  outrosDescontos: Number,
  salarioLiquido: {
    type: Number,
    required: true
  }
});

const Salario = mongoose.model('Salario', salarioSchema);

// collections for users
const userSchema = mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalmongoose);

const NewUser = mongoose.model('NewUser', userSchema);

passport.use(NewUser.createStrategy());
passport.serializeUser(NewUser.serializeUser());
passport.deserializeUser(NewUser.deserializeUser());

// authentication and security
app.get('/', (req, res)=>{
  res.render('home1');
});

app.get('/login', (req, res)=> {
  res.render('login');
});

app.post('/login', (req, res)=> {
    const user = new NewUser({
      username: req.body.username,
      password: req.body.password
    });

    req.login(user, (err)=>{
      if (err){
        console.log(err);
      } else {
        passport.authenticate('local')(req, res, ()=>{
          res.redirect('/home')
        });
      }
    });
});

app.get('/register', (req, res)=>{
  res.render('register');
});

app.post('/register', (req, res)=>{
  NewUser.register({username: req.body.username}, req.body.password, (err, user)=>{
    if (err){
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, ()=>{
        res.redirect('/home');
      });
    }
  });

});


// targeting all salaries
app.get('/home', (req, res) => {
  if (req.isAuthenticated){
    Salario.find({}, (err, foundSalaries) => {
      if(!err){
        res.render('home', {salarios: foundSalaries});
      } else {
        console.log(err);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.post('/home', (req, res) => {
  res.redirect('/Processador')
});

app.get('/logout', (req, res)=>{
  req.logout((err)=>{
    if (err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.route('/Processador')
  .get((req, res)=> {
    const day = date.getDate();
    res.render('Processador', {kindOfDay: day});
})

.post((req, res) => {
  let name = req.body.fullName;
  let salarioBase = Number(req.body.salarioBase);
  let subDeAlim = Number(req.body.subDeAlim);
  let subDeTran = Number(req.body.subDeTran);
  let faltas = Number(req.body.faltas);
  let descontos = Number(req.body.descontos);

  if (descontos === ''){
    descontos = 0;
  }

  let salarioBruto = salarioBase + (subDeAlim + subDeTran);
  let inss = salarioBruto * (3/100);

  let exAlim = date.getExSub(subDeAlim);
  let exTran = date.getExSub(subDeTran);

  let excesso = exAlim + exTran;
  let materiaColetavel = (salarioBase + excesso) - inss;
  let irt = date.getIrt(materiaColetavel);
  let descontoFaltas = date.getfalta(salarioBruto, faltas);
  let salarioLiquido = salarioBruto - (irt + inss + descontoFaltas + descontos);

  // inserting data into the database
  const salario = new Salario({
    name: name,
    salarioBruto: salarioBruto,
    inss: inss,
    irt: irt,
    faltas: descontoFaltas,
    outrosDescontos: descontos,
    salarioLiquido: salarioLiquido
  });
  salario.save();
  res.redirect('/home');
});
/// Creating about, contact page

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/results', (req, res) => {
  res.redirect('/home');
});

// Getting a specific salary
app.route('/home/:name')
  .get((req, res)=>{
    Salario.findOne({name: req.params.name}, (err, foundSalary) => {
      if (!err){
        res.render('results', {salary: foundSalary});
      } else {
        console.log(err);
      }
    });
  });

// update one the document - Not working yet

app.listen(3000, ()=> {
  console.log('Server runing at port 3000');
});
