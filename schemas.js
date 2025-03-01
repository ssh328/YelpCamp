const BaseJoi = require('joi');
const review = require('./models/review');
const sanitizeHtml = require('sanitize-html')

// Joi를 확장하여 사용자 정의 유효성 검사 규칙인 escapeHtml을 추가
// 이를 통해 입력값에서 HTML 태그나 속성을 자동으로 제거하거나 허용되지 않은 HTML이 포함된 경우 에러를 반환
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                    return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)   // 확장된 Joi를 생성

// 캠프장 데이터의 유효성 검사 스키마
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

// 리뷰 데이터의 유효성 검사 스키마
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})