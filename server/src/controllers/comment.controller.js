import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

class CommentController {
  read = async (req, res, next) => {
    try {
      const filter = req.query.searchKeyword;
      let where = {};
      if (filter) {
        where.desc = { $regex: filter, $options: "i" };
      }
      let query = Comment.find(where);
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * pageSize;
      const total = await Comment.find(where).countDocuments();
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
        .populate([
          {
            path: "user",
            select: ["avatar", "name", "verified"],
          },
          {
            path: "parent",
            populate: [
              {
                path: "user",
                select: ["avatar", "name"],
              },
            ],
          },
          {
            path: "replyOnUser",
            select: ["avatar", "name"],
          },
          {
            path: "post",
            select: ["slug", "title", "user"],
          },
        ])
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
      console.error("Error in read controller:", error);
      next({
        msg: "Unable to show comment at this moment",
        status: 400,
      });
    }
  };

  readPostComment = async (req, res, next) => {
    try {
      const postSlug = req.params.postSlug;
      const filter = req.query.searchKeyword;

      // Fetch the post based on the slug to get the post ID
      const post = await Post.findOne({ slug: postSlug });

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      let where = { "post._id": post._id }; // Use the post's _id instead of slug
      console.log({ postId: post._id });

      if (filter) {
        where.desc = { $regex: filter, $options: "i" };
      }
      let query = Comment.find(where);
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * pageSize;
      const total = await Comment.find(where).countDocuments();
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
        .populate([
          {
            path: "user",
            select: ["avatar", "name", "verified"],
          },
          {
            path: "parent",
            populate: [
              {
                path: "user",
                select: ["avatar", "name"],
              },
            ],
          },
          {
            path: "replyOnUser",
            select: ["avatar", "name"],
          },
          {
            path: "post",
            select: ["slug", "title", "user"],
          },
        ])
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
      console.error("Error in read controller:", error);
      next({
        msg: "Unable to show comment at this moment",
        status: 400,
      });
    }
  };

  create = async (req, res, next) => {
    try {
      const { desc, slug, parent, replyOnUser } = req.body;
      const post = await Post.findOne({ slug: slug });
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }
      const newComment = new Comment({
        user: req.user._id,
        desc,
        post: post._id,
        parent,
        replyOnUser,
      });
      const savedComment = await newComment.save();
      return res.status(201).json(savedComment);
    } catch (error) {
      next({
        msg: "Unable to post comment at this moment",
        status: 400,
      });
    }
  };
  update = async (req, res, next) => {
    try {
      const { desc, check } = req.body;
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ msg: "Comment not found" });
      }
      comment.desc = desc || comment.desc;
      comment.check = typeof check !== "undefined" ? check : comment.check;
      const updatedComment = await comment.save();

      res.status(200).json({ updatedComment });
    } catch (error) {
      next({
        msg: "Unable to delete comment at this moment",
        status: 400,
      });
    }
  };
  delete = async (req, res, next) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.commentId);
      await Comment.deleteMany({ parent: comment._id });
      if (!comment) {
        return res.status(404).json({ msg: "Comment not found to delete" });
      }
      return res.status(200).json({ msg: "Comment deleted sucessfully" });
    } catch (error) {
      next({
        msg: "Unable to delete comment at this moment",
        status: 400,
      });
    }
  };
}
export default new CommentController();
