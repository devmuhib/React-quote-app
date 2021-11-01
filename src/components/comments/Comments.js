import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import { getAllComments } from "../../lib/api";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./Comments.module.css";
import NewCommentForm from "./NewCommentForm";
import CommentList from "./CommentsList";

const Comments = () => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const params = useParams();

  const { sendRequest, status, data: loadedComment } = useHttp(getAllComments);

  useEffect(() => {
    sendRequest(params.quoteId);
  }, [sendRequest, params]);

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };

  const addedCommentHandler = useCallback(() => {
    sendRequest(params.quoteId);
  }, [sendRequest, params]);

  let comments;
  if (status === "pending") {
    comments = (
      <div className="centered">
        {" "}
        <LoadingSpinner />{" "}
      </div>
    );
  }

  if (status === "completed" && loadedComment && loadedComment.length > 0) {
    return <CommentList comments={loadedComment} />;
  }

  if (
    status === "completed" &&
    (!loadedComment || loadedComment.length === 0)
  ) {
    comments = <p className="centered">No comment found!</p>;
  }

  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className="btn" onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && (
        <NewCommentForm
          quoteId={params.quoteId}
          onAddComment={addedCommentHandler}
        />
      )}
      {comments}
    </section>
  );
};

export default Comments;
