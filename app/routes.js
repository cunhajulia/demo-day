module.exports = function (app, passport, db, multer, ObjectId) {
 

  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      let extensionArray = file.originalname.split('.')
      let extension = extensionArray[extensionArray.length-1]
      console.log(extension)
      cb(null, file.fieldname + '-' + Date.now() + `.${extension}`)
    }
  });
  var upload = multer({ storage: storage });

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
    db.collection('status').find({ posterId: req.user._id }).sort({ date: -1 }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('status.ejs', {
        user: req.user,
        status: result
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
    db.collection('posts').find({ posterId: req.user._id }).sort({ date: 1 }).toArray((err, posts) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        posts: posts
      })
    })
  })

  app.get('/editPost/:id', isLoggedIn, function (req, res) {
    db.collection('posts').find({ _id: ObjectId(req.params.id) }).toArray((err, posts) => {
      if (err) return console.log(err)
      res.render('editPost.ejs', {
        user: req.user,
        post: posts[0]
      })
    })
  })



  app.get('/barcodes', function (req, res) {
    res.render('barcodes.ejs');
  });


  // LOGOUT ==============================

  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('You have safely logged out!')
    });
    res.redirect('/');
  });

  // POST'S ===============================================================

  app.post('/createPost', upload.single('file-to-upload'), (req, res, next) => {
    console.log(req.file)
    let uId = ObjectId(req.session.passport.user)
    db.collection('posts').save({
      posterId: uId,
      description: req.body.description,
      notes: req.body.notes,
      category: req.body.category,
      date: req.body.date,
      docImgPath: 'images/uploads/' + req.file.filename
    },
      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
  });

  app.post('/storeStatus', (req, res, next) => {
    let uId = ObjectId(req.session.passport.user)
    db.collection('status').save({
      posterId: uId,
      status: req.body.status,
      date: req.body.date,
      kitNumber: req.body.kitNumber
    },
      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/status')
      })
  });

// --------------------------------------------------------
  app.post('/details', /*upload.single('image'),*/(req, res) => { //profile part to upload docs, pics - GOT MULTER
    db.collection('details').insertOne({ userID: req.user._id, notes: req.body.notes, timestamp: new Date() }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })
  // --------------------------------------------------------

  app.post('/profile', (req, res) => { 
    db.collection('entries').insertOne({ userID: req.user._id, entry: req.body.entry, favorite: false, timestamp: new Date() }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/psa')
    })
  })

  // PUT'S ===============================================================

  app.put('/status', (req, res) => { 
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

  app.put('/updatePost', (req, res) => {
    let id = req.body.postId
    console.log(req.body)
    db.collection('posts')
      .findOneAndUpdate({ _id: ObjectId(id) }, {
        $set: {
          description: req.body.description,
          notes: req.body.notes,
          category: req.body.category,
          date: req.body.date
        }
      }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/profile')
      })
  })

  // DELETE'S ===============================================================

  app.delete('/deletePost/:id', (req, res) => { //to delete user uploads in profile (in the timeline)
    console.log(req.user._id)
    db.collection('posts').findOneAndDelete({ _id: ObjectId(req.params.id) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('upload deleted!')
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
