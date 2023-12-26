class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went Wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.error = errors

        if (stack) {
            this.stack = this.statck

        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}