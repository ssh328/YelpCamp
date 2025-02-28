// 비동기 함수를 사용하는 경우에 발생할 수 있는 에러를 처리하기 위해 작성된 것
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}