//*note to self: left of colon has to match mongodb!

module.exports = function (app, passport, db) {
  const ObjectId = require('mongodb').ObjectID

  // show the landing page (including buttons that direct to the login + signup)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // GET'S =========================

  app.get('/psa', isLoggedIn, function (req, res) {
    db.collection('entries').find({ userID: req.user._id }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('psa.ejs', {
        user: req.user,
        entries: result
      })
    })
  });

  app.get('/status', isLoggedIn, function (req, res) { 
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('status.ejs', {
        user: req.user,
        messages: result
      })
    })
  });

  app.get('/homepage', isLoggedIn, function (req, res) { 
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('homepage.ejs', {
        user: req.user,
        messages: result
      })
    })
  });

  app.get('/profile', isLoggedIn, function (req, res) { 
    db.collection('steps').find().toArray((err, result) => {
      db.collection('userSteps').find({userID:req.user._id}).toArray((err, userSteps) => {

        if (err) return console.log(err)
        res.render('profile.ejs', {
          user: req.user,
          steps: result,
          userSteps: userSteps
        })
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

  app.post('/psa', (req, res) => { 
    db.collection('entries').insertOne({ userID: req.user._id, entry: req.body.entry, favorite: false, timestamp: new Date() }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/psa')
    })
  })

  app.post('/userSteps/:stepID', (req, res) => {
    db.collection('userSteps').insertOne({ stepID: ObjectId(req.params.stepID), userID: req.user._id, notes: req.body.notes, completed: req.body.completed, timestamp: new Date()}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })

  // PUT'S ===============================================================

  app.put('/psa', (req, res) => { 
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

  app.delete('/psa', (req, res) => {
    console.log(req.user._id)
    db.collection('entries').findOneAndDelete({ _id: ObjectId(req.body.entryID) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('entry deleted!')
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
    successRedirect: '/homepage', // redirect to the secure profile section
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
    successRedirect: '/homepage', // redirect to the secure profile section
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
      res.redirect('/homepage');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
