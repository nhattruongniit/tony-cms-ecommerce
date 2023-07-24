const router = require('express').Router();
const User = require('../model/User');


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
  }

  // create new item
  const newItem = new User({
    first_name,
    last_name,
    email,
    password
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