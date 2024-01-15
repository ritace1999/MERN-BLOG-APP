import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

class CommentController {
  read = async (req, res, next) => {
    try {
      const comments = await Comment.find();
      if (comments.length == 0) {
        return res.status(404).json({ msg: "Comment not found" });
      }
      return res.json(comments);
    } catch (error) {
      next({
        msg: "Unable to show post at this moment",
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
      const { desc } = req.body;
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ msg: "Comment not found" });
      }
      comment.desc = desc || comment.desc;
      const updatedComment = await comment.save();

      res.status(201).json({ updatedComment });
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
      return res.status(201).json({ msg: "Comment deleted sucessfully" });
    } catch (error) {
      next({
        msg: "Unable to delete comment at this moment",
        status: 400,
      });
    }
  };
}
export default new CommentController();
