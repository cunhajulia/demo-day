//*please note: starter api (complete get, put, post, delete) is '/journal'

module.exports = function (app, passport, db) {
const ObjectId = require('mongodb').ObjectID

  // show the landing page (including buttons that direct to the login + signup)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // GET'S *please note: I added gets for each page but have not modified them yet (as of this first draft)=========================
  app.get('/ep', isLoggedIn, function (req, res) { //get for emergency plan page 
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('ep.ejs', {
        user: req.user,
        messages: result
      })
    })
  });

  app.get('/journal', isLoggedIn, function (req, res) { //get for journal page 
    db.collection('entries').find({userID: req.user._id}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('journal.ejs', {
        user: req.user,
        entries: result
      })
    })
  });

  app.get('/saeck', isLoggedIn, function (req, res) { //get for saeck number input page 
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('saeck.ejs', {
        user: req.user,
        messages: result
      })
    })
  });

  app.get('/wellness', isLoggedIn, function (req, res) { //get for wellness page 
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('wellness.ejs', {
        user: req.user,
        messages: result
      })
    })
  });

  app.get('/profile', isLoggedIn, function (req, res) { //get for main profile page (that user sees upon login)
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        messages: result
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('You have safely logged out!')
    });
    res.redirect('/');
  });

  // POST'S ===============================================================

  app.post('/journal', (req, res) => { //post for my journal; note: favorited entries set to true for now but I will modify this (my plan is to replace the star with a different css component- but in theory, it will still enable the user to favorite their preferred entry)
    db.collection('entries').insertOne({ userID: req.user._id, entry: req.body.entry, favorite: false, timestamp: new Date()}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/journal')
    })
  })

// PUT'S ===============================================================

  app.put('/journal', (req, res) => { //put for my journal; *note to self: left of colon has to match mongodb!
    console.log(req.body)
    db.collection('entries')
      .findOneAndUpdate({ _id: ObjectId(req.body.entryID) }, {
        $set: {
          favorite: true
        }
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

// DELETE'S ===============================================================

  app.delete('/journal', (req, res) => {
    console.log(req.user._id)
    db.collection('entries').findOneAndDelete({ _id: ObjectId(req.body.entryID) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Journal entry deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
