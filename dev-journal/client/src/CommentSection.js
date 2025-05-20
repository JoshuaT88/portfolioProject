// CommentSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommentSection.css';

function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://portfolioproject-1.onrender.com/api/comments/${postId}`)
      .then(res => {
        setComments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Comment fetch error:', err);
        setLoading(false);
      });
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentBody) return;

    try {
      const res = await axios.post(`https://portfolioproject-1.onrender.com/api/comments/${postId}`, {
        body: commentBody,
        userId: user.uid,
        userName: user.displayName || user.email
      });
      setComments([...comments, res.data]);
      setCommentBody('');
    } catch (err) {
      console.error('Comment submit error:', err);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>

      {loading ? (
        <p className="loading-comments">Loading comments...</p>
      ) : (
        comments.map(comment => (
          <div key={comment._id} className="comment">
            <p>{comment.body}</p>
            <small>— {comment.userName} • {new Date(comment.date).toLocaleString()}</small>
          </div>
        ))
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Write a comment..."
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
        />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
}

export default CommentSection;
