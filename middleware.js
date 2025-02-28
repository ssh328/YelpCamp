const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review')

// 다음 미들웨어 또는 라우트 핸들러로 넘어가도록 함
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// 사용자가 로그인되어 있는지 확인하는 미들웨어
module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl
    if (!req.isAuthenticated()) {
        req.flash('error', '먼저 로그인하세요!');
        return res.redirect('/login');
    }
    next();
}

// 캠프장 데이터가 유효한지 검증하는 미들웨어
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// 캠프장의 작성자인지 확인하는 미들웨어
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', '권한이 없습니다!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

// 리뷰의 작성자인지 확인하는 미들웨어
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', '권한이 없습니다!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

// 리뷰 데이터가 유효한지 검증하는 미들웨어
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}