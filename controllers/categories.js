const Category = require('../models/category');


module.exports.renderNewForm = (req, res) => {
    res.render('categories/new', {});
}

module.exports.createCategory = async(req, res) => {
    const category = new Category(req.body.category);
    await category.save();
    res.redirect('/setup');
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.render('categories/edit', { category });
}

module.exports.updateCategory = async(req, res) => {
    const { id } = req.params;
    await Category.findByIdAndUpdate(id, req.body.category, { runValidators: true, new: true });
    res.redirect('/setup');
}