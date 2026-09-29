const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { memoryStore, saveStore, isMongoConnected, generateId } = require('../utils/storage');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'alzaban_hardware_jwt_secret_lahore_2026_pk', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        phone: phone || '',
        address: address || { city: 'Lahore', province: 'Punjab' }
      });

      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address
        },
        token: generateToken(user._id)
      });
    } else {
      const userExists = memoryStore.users.find(u => u.email === normalizedEmail);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: generateId(),
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'customer',
        phone: phone || '',
        address: address || { street: '', city: 'Lahore', province: 'Punjab', postalCode: '' },
        createdAt: new Date().toISOString()
      };

      memoryStore.users.push(newUser);
      saveStore();

      return res.status(201).json({
        success: true,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          address: newUser.address
        },
        token: generateToken(newUser._id)
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user && (await user.comparePassword(password))) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address
          },
          token: generateToken(user._id)
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    } else {
      const user = memoryStore.users.find(u => u.email === normalizedEmail);
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return res.json({
            success: true,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone,
              address: user.address
            },
            token: generateToken(user._id)
          });
        }
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (isMongoConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (address) user.address = { ...user.address, ...address };

      const updatedUser = await user.save();
      return res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address
        }
      });
    } else {
      const userIdx = memoryStore.users.findIndex(u => u._id.toString() === req.user._id.toString());
      if (userIdx === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) memoryStore.users[userIdx].name = name;
      if (phone) memoryStore.users[userIdx].phone = phone;
      if (address) memoryStore.users[userIdx].address = { ...memoryStore.users[userIdx].address, ...address };

      saveStore();

      const { password, ...safeUser } = memoryStore.users[userIdx];
      return res.json({
        success: true,
        user: safeUser
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
