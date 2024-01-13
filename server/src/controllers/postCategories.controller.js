import PostCategories from "../models/postCategories.model.js";
import Post from "../models/post.model.js";
class PostCategoriesController {
  read = async (req, res, next) => {
    try {
      const category = await PostCategories.find({});
      if (category.length == 0) {
        return res.status(404).json({ msg: "Category not found" });
      }
      return res.json({ category });
    } catch (error) {
      next({
        msg: "Unable to show categories at this moment",
        status: 400,
      });
    }
  };
  create = async (req, res, next) => {
    try {
      const { title } = req.body;
      const category = await PostCategories.findOne({ title });

      if (category) {
        return res.status(403).json({ msg: "Category already created" });
      }
      const newCategory = await PostCategories.create({ title });

      return res
        .status(201)
        .json({ category: newCategory, msg: "Category created successfully" });
    } catch (error) {
      console.error(error);
      next({
        msg: "Unable to create categories at this moment",
        status: 500,
      });
    }
  };

  update = async (req, res, next) => {
    try {
      const categoryId = req.params.id;
      const categories = await PostCategories.findByIdAndUpdate(
        categoryId,
        req.body,
        { new: true }
      );
      if (!categories) {
        return res.status(404).json({ msg: "Category not found" });
      }
      return res
        .status(201)
        .json({ categories, msg: "Category updated sucessfully" });
    } catch (error) {
      next({
        msg: "Unable to update category at this moment",
        status: 400,
      });
    }
  };
  delete = async (req, res, next) => {
    try {
      const categoryId = req.params.id;
      await Post.updateMany(
        { categories: { $in: [categoryId] } },

        { $pull: { categories: categoryId } }
      );
      const category = await PostCategories.findById(categoryId);
      if (!category) {
        return res.status(404).json({ msg: "Category not found" });
      }
      await PostCategories.deleteOne({ _id: categoryId });

      return res.status(200).json({ msg: "Category deleted sucessfully" });
    } catch (error) {
      console.log(error);
      next({
        msg: "Unable to delete category at this moment",
        status: 400,
      });
    }
  };
}

export default new PostCategoriesController();
