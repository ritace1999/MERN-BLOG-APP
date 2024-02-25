import { uploadPic } from "../middleware/upload.profile.js";
import Post from "../models/post.model.js";
import { v4 as uuidv4 } from "uuid";
import { fileRemover } from "../utils/fileRemover.js";
import Comment from "../models/comment.model.js";

class PostController {
  read = async (req, res, next) => {
    try {
      const filter = req.query.searchKeyword;
      let where = {};
      if (filter) {
        where.title = { $regex: filter, $options: "i" };
      }
      let query = Post.find(where);
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * pageSize;
      const total = await Post.find(where).countDocuments();
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
            path: "categories",
            select: ["title"],
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
      next({
        msg: "Unable to show post at this moment",
        status: 400,
      });
    }
  };

  readSpecific = async (req, res, next) => {
    try {
      const filter = req.query.searchKeyword;
      const userId = req.user?._id;

      let where = { user: userId };

      if (filter) {
        where.title = { $regex: filter, $options: "i" };
      }

      let query = Post.find(where);
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * pageSize;
      const total = await Post.find(where).countDocuments();
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
            path: "categories",
            select: ["title"],
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
      console.log(error);
      next({
        msg: "Unable to show posts at this moment",
        status: 400,
      });
    }
  };

  readBySlug = async (req, res, next) => {
    try {
      const post = await Post.findOne({ slug: req.params.slug }).populate([
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
              populate: [
                {
                  path: "user",
                  select: ["avatar", "name"],
                },
              ],
            },
          ],
        },
        {
          path: "categories",

          select: ["_id", "title"],
        },
      ]);

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }
      return res.json(post);
    } catch (error) {
      next({
        msg: "Unable to show post at this moment",
        status: 400,
      });
    }
  };

  createPost = async (req, res, next) => {
    try {
      const post = new Post({
        title: "sample title",
        caption: "sample caption",
        slug: uuidv4(),
        body: {
          type: "doc",
          content: [],
        },
        photo: "",
        user: req.user._id,
      });
      const createdPost = await post.save();
      return res.status(201).json(createdPost);
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
        return res
          .status(200)
          .json({ updatedPost, msg: "Post updated successfully" });
      };

      uploadPic.single("postPhoto")(req, res, async function (err) {
        if (err) {
          next({ msg: "An error occurred while uploading photo " + err });
        } else {
          if (req.file) {
            let filename = post.photo;

            if (filename) {
              await fileRemover(filename);
            }

            post.photo = req.file.filename;
            await handlePostUpdate(req.body.document);
          } else {
            let filename = post.photo;
            post.photo = "";

            if (filename) {
              await fileRemover(filename);
            }

            await handlePostUpdate(req.body.document);
          }
        }
      });
    } catch (error) {
      next({
        msg: "Unable to update post at this moment" + error,
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
      return res.status(200).json({ msg: "Post deleted sucessfully" });
    } catch (error) {
      next({
        msg: "Unable to delete post at this moment",
        status: 400,
      });
    }
  };
}

export default new PostController();
