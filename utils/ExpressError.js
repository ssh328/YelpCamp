// 사용자 정의 오류 메시지와 상태 코드를 포함할 수 있도록 함
class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode; 
    }
}

module.exports = ExpressError;