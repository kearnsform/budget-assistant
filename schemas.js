const Joi = require('joi');

module.exports.transactionSchema = Joi.object({
    transaction: Joi.object({
        account: Joi.string().required(),
        date: Joi.date().required(),
        category: Joi.string().required(),
        company: Joi.string().optional().allow(''),
        notes: Joi.string().optional().allow(''),
        amount: Joi.number().precision(2).required(),
        clearingDate: Joi.date().allow("")
    }).required()
});

module.exports.budgetItemSchema = Joi.object({
    budgetItem: Joi.object({
        category: Joi.string().required(),
        amount: Joi.number().required()
    }).required()
});

module.exports.accountSchema = Joi.object({
    account: Joi.object({
        name: Joi.string().required()
    }).required()
});

module.exports.categorySchema = Joi.object({
    category: Joi.object({
        name: Joi.string().required(),
        type: Joi.string().required(),
        active: Joi.boolean()
    }).required()
});