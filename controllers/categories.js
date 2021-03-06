const { Category, Ingredient } = require("../db/models");

exports.fetchCategory = async (categoryId, next) => {
  console.log(categoryId);

  try {
    const categoryFound = await Category.findByPk(categoryId);
    if (categoryFound) return categoryFound;
    else next({ message: "Category does not exist" });
  } catch (error) {
    next(error);
  }
};

exports.ingredientCreate = async (req, res, next) => {
  try {
    console.log("id", req.category.id);
    req.body.categoryId = req.category.id;
    req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    console.log(req.body);
    const newIngredient = await Ingredient.create(req.body);
    console.log(newIngredient);
    res.status(201).json(newIngredient);
  } catch (error) {
    next(error);
  }
};
exports.categoryList = async (req, res, next) => {
  console.log("hello");
  try {
    const categories = await Category.findAll({
      attributes: req.body,
      attributes: { exclude: ["updatedAt", "createdAt"] },

      include: {
        model: Ingredient,
        as: "ingredients",
        attributes: ["id"],
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

exports.categoryCreate = async (req, res, next) => {
  try {
    req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;

    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

exports.categoryDetail = async (req, res, next) => {
  res.status(200).json(req.category);
};

exports.categoryUpdate = async (req, res, next) => {
  if (req.file) {
    req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
  }
  await req.category.update(req.body);
  res.status(200).json(req.category);
};

exports.categoryDelete = async (req, res, next) => {
  await req.category.destroy();
  res.status(204).end();
};
