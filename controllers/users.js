const User = require('../models/user');

// 회원가입 페이지 렌더링하는 함수
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

// 회원가입을 처리하는 함수
module.exports.register = async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
    
        // 새로운 사용자에 대해 암호를 해시하고 솔트를 저장하고 결과를 해시
        const registeredUser = await User.register(user, password);
        
        // req.login: Passport에서 로그인 세션을 위해 지원하는 것으로 Passport.authenticate는 req.login을 자동 호출
        // 사용자가 계정을 등록하거나 가입할 때 사용되는 것으로 새로운 사용자가 자동으로 로그인 상태를 유지
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
}

// 로그인 페이지 렌더링하는 함수
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

// 로그인을 처리하는 함수
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

// 로그아웃을 처리하는 함수
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}