import { ValidationError } from '../utils/errors.js'

export const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) {
      req.body = schema.body.parse(req.body)
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query)
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params)
    }
    next()
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }))
      return next(new ValidationError('Validation failed', formattedErrors))
    }
    next(err)
  }
}
