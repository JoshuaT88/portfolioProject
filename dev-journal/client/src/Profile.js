import React from 'react';
import './Profile.css';

function Profile({ user, posts }) {
  const userPosts = posts.filter(post => post.authorId === user.uid);
  return (
    <div className="profile-page">
      <img src={user.photoURL} alt="Avatar" className="profile-avatar" />
      <h2>{user.displayName || user.email}</h2>
      <p>@{user.username}</p>

      <div className="stats">
        <span>{userPosts.length} posts</span>
        <span>0 followers</span>
        <span>0 following</span>
      </div>

      <div className="user-posts">
        {userPosts.map(post => (
          <div key={post._id} className="user-post-card">
            <h4>{post.title}</h4>
            <p>{post.body.slice(0, 60)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
