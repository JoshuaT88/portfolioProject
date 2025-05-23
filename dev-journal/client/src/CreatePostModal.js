import React from 'react';
import './CreatePostModal.css';

function CreatePostModal({ isOpen, onClose, onSubmit, form, setForm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>New Post</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Post title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Post body"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
          <button type="submit">Post</button>
        </form>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default CreatePostModal;
