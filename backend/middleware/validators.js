const { body, param } = require('express-validator');

// ── Auth ───────────────────────────────────────────────────
exports.registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
];

exports.loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ── Jobs ───────────────────────────────────────────────────
exports.jobRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: 100 }).withMessage('Title too long (max 100 chars)'),

  body('company')
    .trim()
    .notEmpty().withMessage('Company is required')
    .isLength({ max: 100 }).withMessage('Company too long (max 100 chars)'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),

  body('type')
    .trim()
    .notEmpty().withMessage('Job type is required')
    .isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'])
    .withMessage('Invalid job type'),

  body('salary')
    .notEmpty().withMessage('Salary is required')
    .isNumeric().withMessage('Salary must be a number')
    .custom(v => v >= 0).withMessage('Salary cannot be negative'),

  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP']).withMessage('Currency must be USD, EUR, or GBP'),

  body('experienceLevel')
    .optional()
    .isIn(['Entry Level', 'Mid Level', 'Senior Level', 'Executive'])
    .withMessage('Invalid experience level'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 5000 }).withMessage('Description too long (max 5000 chars)'),

  body('logo')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Logo must be a valid URL'),
];

// ── Admin — user update ────────────────────────────────────
exports.updateUserRules = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
];

// ── Admin — application status ─────────────────────────────
exports.statusRules = [
  param('id')
    .isMongoId().withMessage('Invalid application ID'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'accepted', 'rejected'])
    .withMessage('Status must be pending, accepted, or rejected'),
];

// ── Generic MongoID param ──────────────────────────────────
exports.mongoIdParam = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];
