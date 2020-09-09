const Category = require('../models/categoryModel');
const AppError = require('../utils/appError');
const handleAsyncError = require('../utils/handleAsyncError');

exports.getAllCategories = handleAsyncError(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json(categories);
});

exports.getCategory = handleAsyncError(async (req, res, next) => {
    const category = await Category.findById(+req.params.id);

    if (!category) {
        return next(new AppError('No category found with this ID', 404));
    }

    res.status(200).json(category);
});

exports.createCategory = handleAsyncError(async (req, res, next) => {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
});

exports.updateCategory = handleAsyncError(async (req, res, next) => {
    const categoryToUpdate = await Category.findByIdAndUpdate(
        +req.params.id,
        req.body, 
        {
            new: true,
            runValidators: true
        }
    );

    if (!categoryToUpdate) {
        return next(new AppError('No category found with this ID', 404));
    }

    res.status(200).json(categoryToUpdate);
});

exports.deleteCategory = handleAsyncError(async (req, res, next) => {
    const categoryToDelete = await Category.findByIdAndDelete(req.params.id);

    if (!categoryToDelete) {
        return next(new AppError('No category found with this ID', 404));
    }

    res.status(204).json();
}); 