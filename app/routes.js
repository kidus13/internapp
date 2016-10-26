// app/routes.js
var User = require('./models/user');
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
      app.post('/login', passport.authenticate('local-login', {
          successRedirect : '/dashboard', // redirect to the secure profile section
          failureRedirect : '/login', // redirect back to the signup page if there is an error
          failureFlash : true // allow flash messages
      }));
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // DASHBOARD SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/dashboard', isLoggedIn, function(req, res) {
        console.log(req.session);
        res.render('dashboard.ejs', {
            user : req.session.passport.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // ITEC ================================
    // =====================================
    app.get('/itec', isLoggedIn, function(req, res) {
        res.render('itec.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    
    // =====================================
    // BIO =================================
    // =====================================
    app.get('/bio', isLoggedIn, function(req, res) {
        res.render('bio.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // PROMOTE =============================
    // =====================================
    app.get('/promote', isLoggedIn, function(req, res) {
        if(req.session.passport.user.role=='admin'){
          res.render('promote.ejs');   
        }
        else{
           res.redirect('/dashboard'); 
        }
    });
    app.post('/promote', isLoggedIn, function(req, res,next){
    console.log(req.body.email + ' '+ req.body.role);
    User.update({'local.email': req.body.email}, {'local.role': req.body.role}, function (err, status) {
  if(err) {}
  res.redirect('/dashboard');
});
});
    
    
    
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

