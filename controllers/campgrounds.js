const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const flash = require('connect-flash');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken : mapBoxToken });
const { cloudinary } = require('../cloudinary');


module.exports.index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = catchAsync(async(req,res) => {
    const geoData = await geocoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    campground.images = req.files.map(f => ({ url : f.path, filename : f.filename }));
    campground.geometry = geoData.body.features[0].geometry;
    await campground.save();
    req.flash('success','Succesfully created a New Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
})

module.exports.showCampground = catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path : 'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','Campground Not Found :(');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{ campground });
})

module.exports.renderEditForm = catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{ campground });
})

module.exports.updateCampground = catchAsync(async(req,res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const newImgs = req.files.map(f => ({url : f.path, filename : f.filename}));
    campground.images.push(...newImgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull : { images : { filename : { $in : req.body.deleteImages } } } })
        console.log(campground);
    }
    req.flash('success','Succesfully Updated your Campground');
    res.redirect(`/campgrounds/${campground._id}`);
})

module.exports.deleteCampground = catchAsync(async(req,res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success','Succesfully Deleted Campground!')
    res.redirect('/campgrounds');
})