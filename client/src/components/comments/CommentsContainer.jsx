import { CommentForm } from "./CommentForm";
import { getCommentsData } from "../../data/comments";
import { useEffect, useState } from "react";
import { Comment } from "./Comment";

export const CommentsContainer = ({ className, logginedUserId, comments }) => {
  const [affectedComment, setAffectedComment] = useState(null);

  const addCommentHandler = (value, parent = null, replyOnUser = null) => {
    setAffectedComment(null);
  };
  const updateCommentHandler = (value, commentId) => {
    setAffectedComment(null);
  };
  const deleteCommentHandler = (commentId) => {};

  return (
    <div className={`${className}`}>
      <CommentForm
        btnLabel="Send"
        formHandler={(value) => addCommentHandler(value)}
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
