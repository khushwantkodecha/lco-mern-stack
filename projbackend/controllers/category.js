const Category = require('../models/category');

exports.createCategory = (req, res) => {
	const category = new Category(req.body);
	category.save((err, category) => {
		if (err) {
			return res.status(400).json({
				err : 'Not able to create category!!!'
			});
		}
		res.json({ category });
	});
};

exports.getCategoryById = (req, res, next, id) => {
	Category.findById(id).exec((err, cate) => {
		if (err) {
			return res.status(400).json({
				err : 'category not found in db!!!'
			});
		}
		req.category = cate;
		next();
	});
};

exports.getCategory = (req, res) => {
	return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
	Category.find().exec((err, categories) => {
		if (err) {
			return res.status(400).json({
				err : 'Categories not found!!!'
			});
		}
		return res.json(categories);
	});
};

exports.updateCategory = (req, res) => {
	const category = req.category;
	category.name = req.body.name;

	console.log(category);

	category.save((err, updatedCategory) => {
		if (err) {
			return res.satus(400).json({
				err : 'Unable to udpate category!!!'
			});
		}
		res.json(updatedCategory);
	});
};

exports.removeCategory = (req, res) => {
	const category = req.category;
	category.remove((err, category) => {
		if (err) {
			return res.status(400).json({
				err : 'Failed to delet category!!!'
			});
		}
		res.json({
			message : 'categoy deleted successfully!!!'
		});
	});
};
