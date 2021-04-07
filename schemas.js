const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

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
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.transactionSchema = Joi.object({
    transaction: Joi.object({
        account: Joi.string().required().escapeHTML(),
        date: Joi.date().required(),
        category: Joi.string().required().escapeHTML(),
        company: Joi.string().optional().allow('').escapeHTML(),
        notes: Joi.string().optional().allow('').escapeHTML(),
        amount: Joi.number().precision(2).required(),
        clearingDate: Joi.date().allow("")
    }).required()
});

module.exports.budgetItemSchema = Joi.object({
    budgetItem: Joi.object({
        category: Joi.string().required().escapeHTML(),
        amount: Joi.number().required()
    }).required()
});

module.exports.accountSchema = Joi.object({
    account: Joi.object({
        name: Joi.string().required().escapeHTML()
    }).required()
});

module.exports.categorySchema = Joi.object({
    category: Joi.object({
        name: Joi.string().required().escapeHTML(),
        type: Joi.string().required().escapeHTML(),
        active: Joi.boolean()
    }).required()
});