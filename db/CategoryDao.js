const Category = require('../models/category');

async function getCategories(active) {
    let items = [];
    if (active && active === true) {
        items = await Category.find({ active: true });
    } else {
        items = await Category.find({});
    }
    return items.map(i => { return { name: i.name, type: i.type, active: i.active } });
}

exports.getCategories = getCategories;