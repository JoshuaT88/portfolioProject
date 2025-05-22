// src/CommentSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './commentSection.css';

function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://portfolioproject-1.onrender.com/api/comments/${postId}`)
      .then(res => {
        setComments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await axios.post('https://portfolioproject-1.onrender.com/api/comments', {
        postId,
        text,
        userId: user.uid,
        userName: user.displayName
      });
      setComments([res.data, ...comments]);
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      {loading && <p className="loading-comments">Loading comments...</p>}
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <strong>{comment.userName || 'Anonymous'}</strong>
          <p>{comment.text}</p>
          <small>{new Date(comment.date).toLocaleString()}</small>
        </div>
      ))}
      <form onSubmit={onSubmit} className="comment-form">
        <textarea
          placeholder="Leave a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default CommentSection;
