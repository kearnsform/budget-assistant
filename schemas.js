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
        type: Joi.string().required(),
        category: Joi.string().required(),
        amount: Joi.number().required()
    }).required()
});