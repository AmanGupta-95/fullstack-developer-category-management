const Category = require('../models/category');

exports.getAllCategories = async (req, res) => {
  try {
    // fetch the category and populate its children recursively
    const populateChildren = async (categories) => {
      for (let category of categories) {
        //populating the children with value
        await category.populate('children');
        if (category.children.length > 0) {
          // recursive call to populate the children at N levels
          await populateChildren(category.children);
        }
      }
    };

    // finding all the categories with no parent as they are at root level
    const rootCategories = await Category.find({ parent: null });
    await populateChildren(rootCategories);

    res.json({ status: 'success', data: rootCategories });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.addCategory = async (req, res) => {
  const { name, parentId } = req.body;

  try {
    let newCategory;
    // if there is a parentId add the category id inside the parent children
    if (parentId) {
      // fetching the parent document
      const parentCategory = await Category.findById(parentId);
      // handling no parent found
      if (!parentCategory) {
        return res.status(404).json({ message: 'Parent category not found' });
      }
      // creating the new category
      newCategory = new Category({ name, parent: parentCategory.id });
      // adding the new category in the DB
      await newCategory.save();
      //pushing the new category id inside the parent children
      parentCategory.children.push(newCategory.id);
      // saving the parent document
      await parentCategory.save();
    }
    // if there is not parent id create the category with no parent
    // this are root level categories
    else {
      newCategory = new Category({ name });
      await newCategory.save();
    }
    res.status(201).json({ status: 'success', data: newCategory });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const updatedName = req.body.name;
  try {
    // finding the category and updating its name
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name: updatedName },
      { new: true }
    );
    // handling error when category is not found
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Category not found' });
    }
    res.json({ status: 'success', data: updatedCategory });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    //checking if category exist
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Category not found' });
    }

    // deleting the category and its children recursively
    const deleteCategoryAndChildren = async (categoryId) => {
      const category = await Category.findById(categoryId);

      // checking the children and deleting it recursively
      for (let childId of category.children) {
        await deleteCategoryAndChildren(childId);
      }

      // removing the category from its parent
      if (category.parent) {
        const parentCategory = await Category.findById(category.parent);
        parentCategory.children = parentCategory.children.filter(
          (childId) => childId.toString() !== categoryId
        );
        await parentCategory.save();
      }

      // deleting the category
      await Category.findByIdAndDelete(categoryId);
    };

    await deleteCategoryAndChildren(req.params.id);

    res.json({
      status: 'success',
      message: 'Category and its children deleted',
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
