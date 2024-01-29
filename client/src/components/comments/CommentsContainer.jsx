import { CommentForm } from "./CommentForm";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Comment } from "./Comment";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../../services/index/comments";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export const CommentsContainer = ({
  className,
  logginedUserId,
  comments,
  postSlug,
}) => {
  const queryClient = useQueryClient();
  const [affectedComment, setAffectedComment] = useState(null);
  const userState = useSelector((state) => state.user);
  const { mutate: mutatecreateComment, isLoading: loadingCreateComment } =
    useMutation({
      mutationFn: ({ token, desc, slug, parent, replyOnUser }) => {
        return createComment({
          token,
          desc,
          slug,
          parent,
          replyOnUser,
        });
      },
      onSuccess: () => {
        toast.success(
          "Comment sent sucessfully. It will be visible after Admin confirmation."
        );
      },
      onError: (error) => {
        toast.error("Cannot send empty comment");
      },
    });
  const { mutate: mutateUpdateComment } = useMutation({
    mutationFn: ({ token, desc, commentId }) => {
      return updateComment({
        token,
        desc,
        commentId,
      });
    },
    onSuccess: () => {
      toast.success("Comment edited sucessfully.");
      queryClient.invalidateQueries(["blog", postSlug]);
    },
    onError: (error) => {
      toast.error("Cannot send empty comment");
    },
  });
  const { mutate: mutateDeleteComment } = useMutation({
    mutationFn: ({ token, commentId }) => {
      return deleteComment({
        token,
        commentId,
      });
    },
    onSuccess: () => {
      toast.success("Comment deleted sucessfully.");
      queryClient.invalidateQueries(["blog", postSlug]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const addCommentHandler = (value, parent = null, replyOnUser = null) => {
    mutatecreateComment({
      token: userState.userInfo.token,
      desc: value,
      slug: postSlug,
      parent,
      replyOnUser,
    });
    setAffectedComment(null);
  };
  const updateCommentHandler = (value, commentId) => {
    mutateUpdateComment({
      token: userState.userInfo.token,
      desc: value,
      commentId,
    });
    setAffectedComment(null);
  };
  const deleteCommentHandler = (commentId) => {
    mutateDeleteComment({
      token: userState.userInfo.token,
      commentId,
    });
  };

  return (
    <div className={`${className}`}>
      <CommentForm
        btnLabel="Send"
        formHandler={(value) => addCommentHandler(value)}
        loading={loadingCreateComment}
      />
      <div className="space-y-4 mt-8">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            logginedUserId={logginedUserId}
            affectedComment={affectedComment}
            setAffectedComment={setAffectedComment}
            addComment={addCommentHandler}
            updateComment={updateCommentHandler}
            deleteComment={deleteCommentHandler}
            replies={comment.replies}
          />
        ))}
      </div>
    </div>
  );
};
