export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = true
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden: Insufficient permissions') {
    super(message, 403)
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid request parameters', details = null) {
    super(message, 400, details)
  }
}
