const ErrType = require('../constants/errType');
const ErrCode = require('../constants/errCode');

class ResponseUtil {
    constructor(type, errMsg, errCode, date = new Date(), errorMoreInfo = null) {
        this.type = type;
        this.errMsg = errMsg;
        this.errCode = errCode;
        this.date = date;
        this.errorMoreInfo = errorMoreInfo;
    }

    static info(message) {
        return new ResponseUtil(ErrType.INFO, message, ErrCode.INFO);
    }

    static validationError(message) {
        return new ResponseUtil(ErrType.INFO, message, ErrCode.INFO);
    }

    static success(data, errorMoreInfo = null) {
        return new ResponseUtil(ErrType.SUCCESS, data, ErrCode.SUCCESS, new Date(), errorMoreInfo);
    }

    static databaseError() {
        return new ResponseUtil(ErrType.ERROR, "Database Error", ErrCode.DATABASE_ERROR);
    }

    static internalServerError() {
        return new ResponseUtil(ErrType.ERROR, "Internal server error", ErrCode.EXCEPTION);
    }
    
    static notFound(message = "Data not found", code = ErrCode.DATA_NOT_FOUND) {
        return new ResponseUtil(ErrType.INFO, message, code);
    }
}

module.exports = ResponseUtil;
