const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

module.exports.renderRegisterForm = (req,res) => {
    res.render('users/register.ejs');
}

module.exports.registerUser = catchAsync(async(req,res) => {
    const { email,username,password } = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,err => {
        if(err){
            return next(err);
        }
    })
    req.flash('success','Welcome To HappyHikers!');
    res.redirect('/campgrounds');
})

module.exports.renderLoginForm = (req,res) => {
    res.render('users/login.ejs');
}

module.exports.loginUser = (req,res) => {
    req.flash('success','Welcome Back!!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res) => {
    req.logout();
    req.flash('success','Successfully Logged Out!')
    res.redirect('/campgrounds')
}