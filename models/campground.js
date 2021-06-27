const mongoose = require('mongoose');
const Review = require('./review');

const opts = { toJSON : { virtuals : true } };

const ImageSchema = new mongoose.Schema({
    url : String,
    filename : String
},opts)

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_200');
});


const CampgroundSchema = new mongoose.Schema({
    title : String,
    images : [ImageSchema],
    // GeoJOSN object (geometry)
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    price : Number,
    description : String,
    location : String,
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
},opts);


CampgroundSchema.virtual('properties.popUpText').get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>`;
})

CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id : {
                $in : doc.reviews
            }
        })
    }
})

const Campground = mongoose.model('Campground',CampgroundSchema);

module.exports = Campground;

