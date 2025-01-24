import React, { useState } from "react";
import ProfileOverlay from "./ProfileOverlay.js";
import "./Commentaires.css";

const Commentaires = ({ commentaires, user, onAddComment, onReply, onLike }) => {
  const [newComment, setNewComment] = useState("");
  const [activeReplyBox, setActiveReplyBox] = useState(null);
  const [hoveredProfile, setHoveredProfile] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [replyText, setReplyText] = useState({});

  const handleAddComment = () => {
    if (!user) {
      alert("Vous devez être connecté pour ajouter un commentaire.");
      return;
    }
    if (newComment.trim() !== "") {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  const handleReply = (commentId) => {
    if (!user) {
      alert("Vous devez être connecté pour répondre.");
      return;
    }
    const reply = replyText[commentId]?.trim();
    if (reply) {
      onReply(commentId, reply);
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setActiveReplyBox(null);
    }
  };

  const handleLike = (commentId) => {
    if (!user) {
      alert("Vous devez être connecté pour liker un commentaire.");
      return;
    }
    onLike(commentId);
  };

  const toggleRepliesVisibility = (commentId) => {
    setVisibleReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  return (
    <div className="commentaires-container">
      <h3>Commentaires</h3>

      {/* Ajouter un nouveau commentaire */}
      <div className="new-comment">
        <textarea
          placeholder="Ajoutez un commentaire..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
        />
        {newComment.trim() && (
          <div className="new-comment-actions">
            <button onClick={() => setNewComment("")} className="cancel-btn">
              Annuler
            </button>
            <button onClick={handleAddComment} className="publish-btn">
              Publier
            </button>
          </div>
        )}
      </div>

      {/* Liste des commentaires */}
      <ul className="commentaires-list">
        {commentaires && commentaires.length > 0 ? (
          commentaires.map((comment) => (
            <li key={comment.id} className="commentaire-item">
              <div
                className="comment-profile"
                onMouseEnter={() => setHoveredProfile(comment.user)}
                onMouseLeave={() => setHoveredProfile(null)}
              >
                <img
                  src={comment.user.avatar}
                  alt={`${comment.user.username}'s avatar`}
                  className="profile-avatar"
                />
                {hoveredProfile === comment.user && (
                  <ProfileOverlay user={comment.user} />
                )}
              </div>

              <div className="comment-content">
                <div className="comment-header">
                  <strong>{comment.user.username}</strong>
                  <span className="comment-date">{comment.date}</span>
                </div>
                <p>{comment.text}</p>
                <div className="comment-actions">
                  <button
                    className="like-btn"
                    onClick={() => handleLike(comment.id)}
                  >
                    👍 {comment.likes}
                  </button>
                  <button
                    className="reply-btn"
                    onClick={() =>
                      setActiveReplyBox(activeReplyBox === comment.id ? null : comment.id)
                    }
                  >
                    Répondre
                  </button>
                </div>
              </div>

              {/* Boîte de réponse */}
              {activeReplyBox === comment.id && (
                <div className="reply-box">
                  <textarea
                    className="reply-input"
                    placeholder="Écrivez une réponse..."
                    value={replyText[comment.id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [comment.id]: e.target.value,
                      }))
                    }
                  />
                  <div className="reply-actions">
                    <button
                      onClick={() => setActiveReplyBox(null)}
                      className="cancel-btn"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleReply(comment.id)}
                      className="publish-btn"
                    >
                      Publier
                    </button>
                  </div>
                </div>
              )}

              {/* Affichage des réponses */}
              {comment.replies.length > 0 && (
                <div>
                  <button
                    className="toggle-replies-btn"
                    onClick={() => toggleRepliesVisibility(comment.id)}
                  >
                    {visibleReplies[comment.id] ? "Voir moins" : "Voir plus"}
                  </button>
                  {visibleReplies[comment.id] && (
                    <ul className="replies-list">
                      {comment.replies.map((reply) => (
                        <li key={reply.id} className="reply-item">
                          <div
                            className="comment-profile"
                            onMouseEnter={() => setHoveredProfile(reply.user)}
                            onMouseLeave={() => setHoveredProfile(null)}
                          >
                            <img
                              src={reply.user.avatar}
                              alt={`${reply.user.username}'s avatar`}
                              className="profile-avatar"
                            />
                            {hoveredProfile === reply.user && (
                              <ProfileOverlay user={reply.user} />
                            )}
                          </div>
                          <div className="reply-content">
                            <strong>{reply.user.username}</strong>
                            <p>{reply.text}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))
        ) : (
          <p>Aucun commentaire disponible</p>
        )}
      </ul>
    </div>
  );
};

export default Commentaires;
