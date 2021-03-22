const Joi = require('joi');

module.exports.transactionSchema = Joi.object({
    transaction: Joi.object({
        accountId: Joi.number().integer().required(),
        date: Joi.date().required(),
        category: Joi.string().required(),
        company: Joi.string().optional().allow(''),
        description: Joi.string().optional().allow(''),
        amount: Joi.number().precision(2).required(),
        clearingDate: Joi.date().allow("")
    }).required()
});