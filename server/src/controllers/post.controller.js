import { uploadPic } from "../middleware/upload.profile.js";
import Post from "../models/post.model.js";
import { v4 as uuidv4 } from "uuid";
import { fileRemover } from "../utils/fileRemover.js";
import Comment from "../models/comment.model.js";

class PostController {
  read = async (req, res, next) => {
    try {
      const post = await Post.find({}).populate([
        {
          path: "user",
          select: ["avatar", "name", "verified"],
        },
      ]);

      if (post.length == 0) {
        return res.status(404).json({ msg: "Post not found" });
      }
      return res.json({ post });
    } catch (error) {
      next({
        msg: "Unable to show post at this moment",
        status: 400,
      });
    }
  };

  readBySlug = async (req, res, next) => {
    try {
      const post = await Post.find({ slug: req.params.slug }).populate([
        {
          path: "user",
          select: ["avatar", "name"],
        },
        {
          path: "comments",
          match: { check: true, parent: null },
          populate: [
            {
              path: "user",
              select: ["avatar", "name"],
            },
            {
              path: "replies",
              match: { check: true },
            },
          ],
        },
      ]);

      if (post.length == 0) {
        return res.status(404).json({ msg: "Post not found" });
      }
      return res.json({ post });
    } catch (error) {
      next({
        msg: "Unable to show post at this moment",
        status: 400,
      });
    }
  };

  createPost = async (req, res, next) => {
    try {
      const post = await Post.create({
        ...req.body,
        slug: uuidv4(),
        user: req.user._id,
      });

      return res.status(201).json({ post, msg: "Post created sucessfully" });
    } catch (error) {
      next({
        msg: "Unable to post at this moment",
        status: 400,
      });
    }
  };
  update = async (req, res, next) => {
    try {
      const post = await Post.findOne({ slug: req.params.slug });
      if (!post) {
        return res.status(404).json({ msg: "No post to update" });
      }
      const upload = uploadPic.single("postPhoto");
      const handlePostUpdate = async (data) => {
        const { title, caption, slug, body, tags, categories } =
          JSON.parse(data);
        post.title = title || post.title;
        post.caption = caption || post.caption;
        post.slug = slug || post.slug;
        post.body = body || post.body;
        post.tags = tags || post.tags;
        post.categories = categories || post.categories;
        const updatedPost = await post.save();
        return res.json({ updatedPost, msg: "Post updated sucessfully" });
      };
      upload(req, res, async function (err) {
        if (err) {
          const error = new Error(
            "An unknown error occurred when uploading" + error.message
          );
          next(error);
        } else {
          if (req.file) {
            let filename;

            filename = post.photo;
            if (filename) {
              fileRemover(filename);
            }
            post.photo = req.file.filename;
            handlePostUpdate(req.body.document);
          } else {
            let filename;
            filename = post.photo;
            post.photo = "";
            fileRemover(filename);
            handlePostUpdate(req.body.document);
          }
        }
      });

      // res.json({ updatedPost, msg: "Post updated" });
    } catch (error) {
      next({
        msg: "Unable to update post at this moment",
        status: 400,
      });
    }
  };
  deletePost = async (req, res, next) => {
    try {
      const post = await Post.findOneAndDelete({ slug: req.params.slug });
      if (!post) {
        return res.status(404).json({ msg: "No post to delete" });
      }
      await Comment.deleteMany({ post: post._id });
      return res.status(201).json({ msg: "Post deleted sucessfully" });
    } catch (error) {
      next({
        msg: "Unable to delete post at this moment",
        status: 400,
      });
    }
  };
}

export default new PostController();
