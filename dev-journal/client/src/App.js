// src/App.js
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import './App.css';
import { auth } from './firebase';
import SignIn from './signIn';
import SettingsMenu from './settingsMenu';
import CommentSection from './CommentSection';
import SetupAccount from './setupAccount';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', body: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', body: '' });
  const [toast, setToast] = useState(null);

  // 1. Listen for Firebase login, check if user has completed setup
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const res = await axios.get(`https://portfolioproject-1.onrender.com/api/users/${currentUser.uid}`);
          if (!res.data || !res.data.username) {
            setIsNewUser(true);
          } else {
            setUser(currentUser);
          }
        } catch {
          setIsNewUser(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
  const interval = setInterval(() => {
    fetch('https://portfolioproject-1.onrender.com/api/posts')
      .then(() => console.log("🔁 Backend pinged to stay awake"))
      .catch((err) => console.error("Ping failed:", err));
  }, 1000 * 60 * 14); // every 14 minutes

  return () => clearInterval(interval);
}, []);
    // Keep the server awake by pinging it every 14 minutes

  // 2. Fetch posts once the user is ready
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios.get('https://portfolioproject-1.onrender.com/api/posts')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
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
      const res = await axios.post('https://portfolioproject-1.onrender.com/api/posts', {
        ...form,
        authorId: user.uid,
        authorName: user.displayName || user.email
      });
      setPosts([res.data, ...posts]);
      setForm({ title: '', body: '' });
      showToast('Post added!', 'success');
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Error submitting post', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`https://portfolioproject-1.onrender.com/api/posts/${id}`, {
        data: { userId: user.uid }
      });
      setPosts(posts.filter(post => post._id !== id));
      showToast('Post deleted', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Not authorized to delete this post', 'error');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`https://portfolioproject-1.onrender.com/api/posts/${id}`, {
        ...editForm,
        userId: user.uid
      });
      setPosts(posts.map(post => (post._id === id ? res.data : post)));
      setEditingPostId(null);
      setEditForm({ title: '', body: '' });
      showToast('Post updated!', 'success');
    } catch (err) {
      console.error('Update error:', err);
      showToast('Update failed or unauthorized', 'error');
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(`https://portfolioproject-1.onrender.com/api/likes/${postId}`, {
        userId: user.uid
      });

      setPosts(posts.map(post => {
        if (post._id === postId) {
          const alreadyLiked = (post.likes || []).includes(user.uid);
          const updatedLikes = alreadyLiked
            ? post.likes.filter(id => id !== user.uid)
            : [...(post.likes || []), user.uid];
          return { ...post, likes: updatedLikes };
        }
        return post;
      }));
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const parseMentions = (text) => {
    return text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</p>;
  if (!user && !isNewUser) return <SignIn onLogin={() => {}} />;
  if (isNewUser) {
  return (
    <SetupAccount
      user={auth.currentUser}
      onComplete={() => {
        setIsNewUser(false);
        setUser(auth.currentUser); // 👈 this should re-trigger feed
      }}
    />
  );
}


  return (
    <>
      {user && <SettingsMenu user={user} />}
      <div className="app-container">
        <h1 className="app-title">Dev Journal</h1>

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
              <p dangerouslySetInnerHTML={{ __html: parseMentions(post.body) }} />
              <small>
                Posted by: {post.authorName || 'Unknown'} <br />
                {new Date(post.date).toLocaleString()}
              </small>

              <div className="post-buttons">
                <button onClick={() => handleLike(post._id)}>
                  ❤️ {post.likes?.length || 0}
                </button>

                {post.authorId === user.uid && (
                  <>
                    <button className="edit" onClick={() => {
                      setEditingPostId(post._id);
                      setEditForm({ title: post.title, body: post.body });
                    }}>Edit</button>

                    <button className="delete" onClick={() => handleDelete(post._id)}>Delete</button>
                  </>
                )}
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

              <CommentSection postId={post._id} user={user} />
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
