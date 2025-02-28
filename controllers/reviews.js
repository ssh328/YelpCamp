const Campground = require('../models/campground');
const Review = require('../models/review');

// 리뷰 생성 함수
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', '리뷰가 생성되었습니다!')
    res.redirect(`/campgrounds/${campground._id}`);
}

// 리뷰 삭제 함수
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    // $pull: 배열에 있는 모든 인스턴스 중에 특정 조건에 만족하는 값을 지움
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', '리뷰가 삭제되었습니다!')
    res.redirect(`/campgrounds/${ id }`);
}