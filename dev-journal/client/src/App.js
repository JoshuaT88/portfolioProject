import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import './App.css';
import { auth } from './firebase';
import SignIn from './signIn';
import SettingsMenu from './settingsMenu';


function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', body: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', body: '' });
  const [toast, setToast] = useState(null);

  // Monitor login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch posts
  useEffect(() => {
    if (!user) return;
    axios.get('https://portfolioproject-1.onrender.com/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Fetch error:', err));
  }, [user]);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.body) {
      showToast('Title and body are required', 'error');
      return;
    }

    try {
      const res = await axios.post('https://portfolioproject-1.onrender.com/api/posts', form);
      setPosts([res.data, ...posts]);
      setForm({ title: '', body: '' });
      showToast('Post added!', 'success');
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Error submitting post', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (!confirm) return;

    try {
      await axios.delete(`https://portfolioproject-1.onrender.com/api/posts/${id}`);
      setPosts(posts.filter(post => post._id !== id));
      showToast('Post deleted', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete post', 'error');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`https://portfolioproject-1.onrender.com/api/posts/${id}`, editForm);
      setPosts(posts.map(post => (post._id === id ? res.data : post)));
      setEditingPostId(null);
      setEditForm({ title: '', body: '' });
      showToast('Post updated!', 'success');
    } catch (err) {
      console.error('Update error:', err);
      showToast('Update failed', 'error');
    }
  };


  if (!user) return <SignIn onLogin={() => {}} />;

  return (
    <>
    {user && <SettingsMenu user={user} />}
    <div className="app-container">
      <h1 className="app-title">📝 Dev Journal</h1>

  return (
    <div className="app-container">
      <h1 className="app-title">📝 Dev Journal</h1>


      <form className="post-form" onSubmit={handleSubmit}>
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
        <button type="submit">+ Add Post</button>
      </form>

      {posts.length === 0 ? (
        <p className="empty-message">No posts yet.</p>
      ) : (
        posts.map(post => (
          <div key={post._id} className="post-card">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <small>{new Date(post.date).toLocaleString()}</small>

            <div className="post-buttons">
              <button className="edit" onClick={() => {
                setEditingPostId(post._id);
                setEditForm({ title: post.title, body: post.body });
              }}>Edit</button>

              <button className="delete" onClick={() => handleDelete(post._id)}>Delete</button>
            </div>

            {editingPostId === post._id && (
              <form className="edit-form" onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(post._id);
              }}>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
                <textarea
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                />
                <button type="submit" className="save">Save</button>
              </form>
            )}
          </div>
        ))
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
    </>
  );
}

export default App;

