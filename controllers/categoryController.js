const Category = require("../models/categoryModel");
const Company = require("../models/companyModel");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/ApiFeatures");
const { where } = require("sequelize");


exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).send({ result : categories.length ,data : categories});
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send({ message: "Name is required" });
  }

  try {
    const newCategory = await Category.create({ name });
    return res.status(201).send(newCategory);
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
};

exports.getCategotyCompanies = async (req, res) => {
  const { categoryId } = req.params;
  const ApiFeature = new ApiFeatures(Category, req.query, "category")
    .search()
    .filter()
    .sort()
    .paginate();
  try {
    const category = await Category.findByPk(categoryId, {
      include: [{ model: Company }],
    });
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    const companies = await ApiFeature.execute();
    return res.status(200).send(companies);
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
};

exports.updateCategory = async (req , res) => {
  const {id} = req.params;
  const category = await Category.update(req.body , {where : {id : id}});
  if(!category) {
    return next(new ApiError(`No Document For This Id ${id}`, 404));
  }
  const newCategory = await Category.findByPk(id);
  res.status(200).send({ data: newCategory });
  
};

exports.deleteCategory = async (req , res) => {
  const {id} = req.params;
  const category = await Category.findByPk(id);
  if(!category) {
    return next(new ApiError(`No Document For This Id ${id}`, 404));
  }
  await Category.destroy({ where: { id: id } });
  res.status(204).send({});
};
