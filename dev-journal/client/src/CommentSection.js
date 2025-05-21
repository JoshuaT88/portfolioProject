// src/CommentSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CommentSection.css'; // Optional: style the comment UI

function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`https://portfolioproject-1.onrender.com/api/comments/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.error('Fetch comments error:', err);
      }
    };

    fetchComments();
  }, [postId]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await axios.post('https://portfolioproject-1.onrender.com/api/comments', {
        postId,
        text,
        userId: user.uid,
        userName: user.displayName || user.email
      });
      setComments([...comments, res.data]);
      setText('');
    } catch (err) {
      console.error('Post comment error:', err);
    }
  };

  return (
    <div className="comment-section">
      <form onSubmit={handleComment} className="comment-form">
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet.</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="comment">
              <strong>{comment.userName}:</strong>
              <span> {comment.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
