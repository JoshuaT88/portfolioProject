import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', body: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    axios.get('https://portfolioproject-5jlv.onrender.com/api/posts')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

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
      const res = await axios.post('https://portfolioproject-5jlv.onrender.com/api/posts', form);
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
      await axios.delete(`https://portfolioproject-5jlv.onrender.com/api/posts/${id}`);
      setPosts(posts.filter(post => post._id !== id));
      showToast('Post deleted', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete post', 'error');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`https://portfolioproject-5jlv.onrender.com/api/posts/${id}`, editForm);
      setPosts(posts.map(post => (post._id === id ? res.data : post)));
      setEditingPostId(null);
      setEditForm({ title: '', body: '' });
      showToast('Post updated!', 'success');
    } catch (err) {
      console.error('Update error:', err);
      showToast('Update failed', 'error');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: "'Inter', sans-serif", maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🚀 Dev Journal</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Post title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{
            width: '100%', padding: '0.75rem', marginBottom: '0.5rem',
            borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem'
          }}
        />
        <textarea
          placeholder="Post body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          style={{
            width: '100%', padding: '0.75rem', minHeight: '120px',
            borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem'
          }}
        />
        <button type="submit" style={{
          marginTop: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '1rem',
          backgroundColor: '#222', color: '#fff', border: 'none',
          borderRadius: '6px', cursor: 'pointer', transition: 'background 0.3s'
        }}>
          Add Post
        </button>
      </form>

      {toast && (
        <div style={{
          position: 'fixed', top: '1rem', right: '1rem',
          backgroundColor: toast.type === 'error' ? '#e63946' : '#2a9d8f',
          color: '#fff', padding: '0.75rem 1.25rem',
          borderRadius: '6px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          {toast.msg}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No posts yet.</p>
      ) : (
        posts.map(post => (
          <div key={post._id} style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease',
            backgroundColor: '#fff'
          }}>
            {editingPostId === post._id ? (
              <>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', fontSize: '1rem' }}
                />
                <textarea
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                  style={{ width: '100%', minHeight: '80px', padding: '0.5rem', fontSize: '1rem' }}
                />
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleUpdate(post._id)} style={{
                    backgroundColor: '#2a9d8f', color: '#fff', border: 'none',
                    padding: '0.4rem 0.8rem', borderRadius: '5px', cursor: 'pointer'
                  }}>
                    Save
                  </button>
                  <button onClick={() => {
                    setEditingPostId(null);
                    setEditForm({ title: '', body: '' });
                  }} style={{
                    backgroundColor: '#ccc', color: '#333', border: 'none',
                    padding: '0.4rem 0.8rem', borderRadius: '5px', cursor: 'pointer'
                  }}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ marginTop: 0 }}>{post.title}</h2>
                <p>{post.body}</p>
                <small style={{ display: 'block', marginBottom: '0.75rem', color: '#777' }}>
                  {new Date(post.date).toLocaleString()}
                </small>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => {
                    setEditingPostId(post._id);
                    setEditForm({ title: post.title, body: post.body });
                  }} style={{
                    backgroundColor: '#457b9d', color: '#fff', border: 'none',
                    padding: '0.4rem 0.8rem', borderRadius: '5px', cursor: 'pointer'
                  }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post._id)} style={{
                    backgroundColor: '#e63946', color: '#fff', border: 'none',
                    padding: '0.4rem 0.8rem', borderRadius: '5px', cursor: 'pointer'
                  }}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
