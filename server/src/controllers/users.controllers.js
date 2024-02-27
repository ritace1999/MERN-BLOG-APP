import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
class UserController {
  read = async (req, res, next) => {
    try {
      const filter = req.query.searchKeyword;
      let where = {};
      if (filter) {
        where.title = { $regex: filter, $options: "i" };
      }
      const loggedInUserId = req.user.id;
      where._id = { $ne: loggedInUserId };
      let query = User.find(where);
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * pageSize;
      const total = await User.find(where).countDocuments();
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

      const result = await query.skip(skip).limit(pageSize);

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
      console.log(error);
      next({
        msg: "Unable to show users at this moment",
        status: 400,
      });
    }
  };

  delete = async (req, res, next) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        res.status(404).json({ msg: "User not found" });
      }
      await Post.deleteMany({ user: userId });
      await Comment.deleteMany({ user: userId });
      await User.findByIdAndDelete(userId);
      res.status(200).json({ msg: "User deleted" });
    } catch (error) {
      next({
        msg: "Unable to delete user at this moment",
        status: 400,
      });
    }
  };
}

export default new UserController();
