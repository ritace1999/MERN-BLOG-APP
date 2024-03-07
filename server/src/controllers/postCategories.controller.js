import PostCategories from "../models/postCategories.model.js";
import Post from "../models/post.model.js";
class PostCategoriesController {
  read = async (req, res, next) => {
    try {
      const filter = req.query.searchKeyword;
      let where = {};
      if (filter) {
        where.title = { $regex: filter, $options: "i" };
      }
      let query = PostCategories.find(where);
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * pageSize;
      const total = await PostCategories.find(where).countDocuments();
      const pages = Math.ceil(total / pageSize);

      res.set({
        "x-filter": filter,
        "x-totalcount": JSON.stringify(total),
        "x-current-page": JSON.stringify(page),
        "x-pagesize": JSON.stringify(pageSize),
        "x-totalpagecount": JSON.stringify(pages),
      });
      if (page > pages) {
        return res.json([]);
      }

      const result = await query
        .skip(skip)
        .limit(pageSize)
        .sort({ updatedAt: "desc" });

      return res.json({
        headers: {
          "x-filter": filter,
          "x-totalcount": total,
          "x-current-page": page,
          "x-pagesize": pageSize,
          "x-totalpagecount": pages,
        },
        data: result,
      });
    } catch (error) {
      next({
        msg: "Unable to show categories at this moment",
        status: 400,
      });
    }
  };
  readById = async (req, res, next) => {
    try {
      const category = await PostCategories.findById(req.params.categoryId);

      if (!category) {
        return res.status(404).json({ msg: "Category not found" });
      }

      return res.json(category);
    } catch (error) {
      next({
        msg: "Unable to create categories at this moment",
        status: 500,
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
      const categoryId = req.params.categoryId;
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
      const categoryId = req.params.categoryId;
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
