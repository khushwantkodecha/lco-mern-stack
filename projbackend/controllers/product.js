const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category')
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          err: 'Product not found!!!',
        });
      }
      req.product = product;
      next();
    });
};

exports.createProdct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        err: 'Problem with image!!!',
      });
    }
    // destructure the fields
    const { name, price, description, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        err: 'Please include all fields!!!',
      });
    }

    let product = new Product(fields);

    // handle files here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          err: 'File size is too big!!!',
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save data to db
    product.save((err, product) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          err: 'Saaving tshirt in db failed!!!',
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//deletion of product
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        err: 'Failed to delete product!!!',
      });
    }
    res.json({
      message: 'Deleted successfully!!!',
    });
  });
};

//updation of product
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        err: 'Problem with image!!!',
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    // handle files here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          err: 'File size is too big!!!',
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save data to db
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          err: 'updation tshirt in db failed!!!',
        });
      }
      res.json(product);
    });
  });
};

//product listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          err: 'No product found!!!',
        });
      } else {
        return res.json(products);
      }
    });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updatOne: {
        filter: {
          _id: prod._id,
        },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      res.status(400).json({
        err: 'Bulk operation failed!!!',
      });
    }
    next();
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct('Category', {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        err: 'No category found!!!',
      });
    }
    res.json(category);
  });
};
