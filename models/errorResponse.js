module.exports = class errorResponse {
    constructor(errorDescription, errorDetail) {
        this.errorDescription = errorDescription;
        this.errorDetail = errorDetail;
    };
}