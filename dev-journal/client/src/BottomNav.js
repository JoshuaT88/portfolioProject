import React from 'react';
import './BottomNav.css';
import { FaHome, FaSearch, FaPlusSquare, FaUserCircle, FaHeart, FaRegCommentDots } from 'react-icons/fa';

function BottomNav() {
  return (
    <div className="bottom-nav">
      <FaHome className="nav-icon" />
      <FaSearch className="nav-icon" />
      <FaPlusSquare className="nav-icon" />
      <FaHeart className="nav-icon" />
      <FaRegCommentDots className="nav-icon" />
      <FaUserCircle className="nav-icon profile-icon" />
    </div>
  );
}

export default BottomNav;
