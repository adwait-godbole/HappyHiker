const mongoose = require('mongoose');
const cities = require('./cities');
const { places,descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/happy-hikers', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 200; i++){
        const rand1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            author : '60cb383aac394c3c88e7ae34',
            location : `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            geometry : {
                type : "Point",
                coordinates : [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude
                ]
            },
            images : [
                {
                  url: 'https://res.cloudinary.com/dstvwyszf/image/upload/v1624623173/HappyHikers/vvr1cdc3bnrccdhuoz9j.jpg',
                  filename: 'HappyHikers/vvr1cdc3bnrccdhuoz9j'
                },
                {
                  url: 'https://res.cloudinary.com/dstvwyszf/image/upload/v1624623178/HappyHikers/vom2u6vkob300e8tqfdb.jpg',
                  filename: 'HappyHikers/vom2u6vkob300e8tqfdb'
                }
              ],
            description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione eaque, dicta minus, delectus molestias quaerat nihil nulla odio voluptates mollitia magni maxime? Voluptatum nihil commodi magnam ad laudantium cumque consequuntur!',
            price : price
        })
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })
    .catch((e) => {
        console.log(e);
    })