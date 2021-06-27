const express = require('express');
const router = express.Router();
const {isLoggedIn, validateCampground, isAuthor} = require('../utils/middleware');
const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/',campgrounds.index);

router.get('/new',isLoggedIn, campgrounds.renderNewForm);

router.get('/:id',campgrounds.showCampground);

router.post('/',isLoggedIn,upload.array('image'),validateCampground,campgrounds.createCampground);

router.get('/:id/edit',isLoggedIn, isAuthor, campgrounds.renderEditForm);

router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validateCampground,campgrounds.updateCampground);

router.delete('/:id',isLoggedIn, isAuthor, campgrounds.deleteCampground);

module.exports = router;