const User = require('../models/user');

module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/habit')
    }
    return res.render('sign_up');
}

module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/habit')
    }
    return res.render('sign_in');
}

module.exports.createUser = async function(req, res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    const user = await User.findOne({email : req.body.email});

    if(user){
        return res.redirect('/');
    }else{
        User.create({
            email : req.body.email,
            password : req.body.password,
            name : req.body.name,
        });
        return res.redirect('/users/sign-in');
    }
}

module.exports.createSession = function(req, res){
    return res.redirect('/habit');
}

module.exports.destroySession = function(req, res){
    req.logout();
    return res.redirect('/')
}