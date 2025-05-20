import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    axios.get(`/api/comments/${postId}`).then(res => setComments(res.data));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/comments', {
      postId,
      text,
      userId: user.uid,
      userName: user.displayName || user.email
    });
    setComments([res.data, ...comments]);
    setText('');
  };

  return (
    <div className="comments">
      <form onSubmit={handleSubmit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add comment" />
        <button type="submit">Post</button>
      </form>
      {comments.map(c => (
        <div key={c._id}>
          <strong>{c.userName}</strong>: {c.text}
        </div>
      ))}
    </div>
  );
}

export default CommentSection;
