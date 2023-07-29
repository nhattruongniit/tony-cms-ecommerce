const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// model
const User = require('../model/User');

// middleware
const auth = require('../middlewares/auth');

// @route   GET api/user/auth
// @desc    Check authorize
// @access  Private
router.get('/auth', auth, async (_, res) => {
  res.status(200).json({
    message: 'You authorized'
  })
})


// @route   GET api/user
// @desc    Get user list
// @access  Public
router.get('/', async (req, res) => {
  // res.send('user route'); // retrutn static file
  try {
    const users = await User.find().sort({ data: -1 });
    const total = users.length;
    
    const data = {
      data: users,
      isSuccess: true,
      total
    }
  
    res.status(200).json({
      data
    })
  } catch(error) {
    res.status(500).json({
      isSuccess: false,
      message: error
    })
  }
})

// @route   POST api/user
// @desc    Create user
// @access  Public
router.post('/', async (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;

  // check email existed
  const isEmailExsited = await User.findOne({ email });
  if(isEmailExsited) {
    res.status(400).json({
      message: 'Email is existed',
      isSucess: false
    })
    return
  };

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // create new item
  const newItem = new User({
    first_name,
    last_name,
    email,
    password: hashPassword
  })

  try {
    await newItem.save();
    res.status(200).json({
      message: 'Create successfully',
      isSucess: true
    })
  } catch(error) {
    res.status(500).json({
      isSuccess: false,
      message: error
    })
  }
})

// @route   POST api/user/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password; 

  try {
    // check email existed
    const user = await User.findOne({ email });
    if(!user) {
      res.status(400).json({
        message: 'Email or password is wrong',
        isSucess: false
      })
      return
    };

    // check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword) {
      res.status(400).json({
        message: 'Email or password is wrong',
        isSucess: false
      })
      return
    }

    // create token
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    }

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: 3600 },
      (err, token) => {
        if(err) {
          res.status(500).json({
            isSuccess: false,
            message: err
          })
          return;
        }
        res.header('x-auth-token', token).status(200).json({
          token,
          msg: 'Login successfully',
          isSucess: true
        })
      }
    )


    // res.status(200).json({
    //   message: 'Login successfully',
    //   isSucess: true
    // })
  } catch(error) {
    res.status(500).json({
      isSuccess: false,
      message: error
    })
  }
})

// @route   POST api/user/checkauth
// @desc    Authenticate user
// @access  Public
router.post('/checkauth', async (req, res) => {
  const token = req.header('x-auth-token');

  if(!token) {
    res.status(404).json({
      message: 'Token is not found',
      isSuccess: false
    })
    return;
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({
      user,
      isSuccess: true
    })
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      message: 'Invalid token'
    })
  }
})

// @route   PUT api/user
// @desc    Update user
// @access  Public
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;

  if(!first_name || !last_name) {
    res.status(404).json({
      message: 'Missing first_name or last_name',
      isSucess: false
    })
    return
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: {
        first_name,
        last_name
      }},
      { new: true }
    );

    if(!user) {
      res.status(400).json({
        message: 'Not found',
        isSucess: false
      })
      return
    }
    res.status(200).json({
      data: user,
      message: 'Update successfully',
      isSucess: true
    })
  } catch(error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message
    })
  }
})

// @route   DELETE api/user
// @desc    Delete user
// @access  Public
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOneAndRemove({ _id: id });

    if(!user) {
      res.status(400).json({
        message: 'Not found',
        isSucess: false
      })
      return
    }
    res.status(200).json({
      message: 'Delete successfully',
      isSucess: true
    })
  } catch(error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message
    })
  }
})

module.exports = router;