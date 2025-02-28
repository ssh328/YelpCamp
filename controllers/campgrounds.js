const Campground = require('../models/campground');
const Review = require('../models/review');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

// 캠핑장 목록을 보여주는 함수
module.exports.index = async (req, res) => {
    // 페이지 번호와 페이지당 항목 수를 쿼리 문자열에서 가져오거나 기본값 설정
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const all_campgrounds = await Campground.find({});
    const campgrounds = await Campground.find({}).skip((page - 1) * limit).limit(limit)

    const campgrounds_count = await Campground.countDocuments({});
    const totalPages = Math.ceil(campgrounds_count / limit);

    // 페이지 범위 설정
    const pagesRange = 10;
    const currentRangeBlock = Math.ceil(page / pagesRange)
    const startPageNum = (currentRangeBlock - 1) * pagesRange + 1;
    const endPageNum = Math.min(currentRangeBlock * pagesRange, totalPages)

    res.render('campgrounds/index', {
        all_campgrounds, 
        campgrounds, 
        currentPage: page, 
        totalPages,
        startPageNum,
        endPageNum
    })
}

// 새로운 캠핑장 생성 폼을 렌더링하는 함수
module.exports.renderNewForm =  (req, res) => {
    res.render('campgrounds/new');
}

// 새로운 캠핑장을 생성하는 함수
module.exports.createCampground = async (req, res, next) => {
    // 사용자가 입력한 위치 정보를 기반으로 지오코딩 데이터를 가져옴
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', '새 캠핑장이 생성되었습니다!')
    res.redirect(`/campgrounds/${campground._id}`)
}

// 특정 캠핑장을 보여주는 함수
module.exports.showCampground = async (req, res) => {
    // 캠핑장 ID를 기반으로 캠핑장을 찾고 관련 리뷰와 작성자를 채워 넣음
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', '캠핑장을 찾을 수 없습니다!')
        return res.redirect('/campgrounds')
    }

    // 리뷰 페이지네이션을 위한 설정
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const reviews = await Review.find({ _id: {$in: campground.reviews} }).populate('author').skip((page - 1) * limit).limit(limit)
    const reviews_count = campground.reviews.length;
    const totalPages = Math.ceil(reviews_count / limit);
    const pagesRange = 10;
    const currentRangeBlock = Math.ceil(page / pagesRange)
    const startPageNum = (currentRangeBlock - 1) * pagesRange + 1;
    const endPageNum = Math.min(currentRangeBlock * pagesRange, totalPages)

    res.render('campgrounds/show', {
        campground, 
        reviews,
        currentPage: page, 
        totalPages,
        startPageNum,
        endPageNum
    });
}

// 캠핑장 수정 폼을 렌더링하는 함수
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', '캠핑장을 찾을 수 없습니다!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}

// 캠핑장을 업데이트하는 함수
module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    // 사용자가 입력한 위치 정보를 기반으로 지오코딩 데이터를 가져옴
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    campground.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: { filename: {$in: req.body.deleteImages}}}})
    }

    req.flash('success', '캠핑장이 수정되었습니다!')
    res.redirect(`/campgrounds/${campground._id}`)
}

// 캠핑장을 삭제하는 함수
module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', '캠핑장이 삭제되었습니다!')
    res.redirect('/campgrounds');
}