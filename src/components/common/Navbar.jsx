import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserLogo from '../../assets/react.svg';
import ProfileModal from './ProfileModal'; // Ensure ProfileModal import

function Navbar() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    id: '',
    email: '',
    department: '',
    role: '',
    joiningDate: ''
  });
  const [jwtExists, setJwtExists] = useState(() => !!localStorage.getItem('jwtToken'));
  const profileBtnRef = useRef(null);
  const activeClass = 'nav-link-active';

  useEffect(() => {
    const checkToken = () => setJwtExists(!!localStorage.getItem('jwtToken'));
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;
        const res = await axios.get('http://localhost:8080/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({
          ...res.data,
          name: res.data.name || 'No Name',
          id: res.data.id || 'N/A',
          email: res.data.email || 'No Email',
          department: res.data.department || 'Not Defined',
          role: res.data.role || 'Member',
          joiningDate: res.data.joiningDate || 'N/A',
        });
      } catch (err) {
        setProfile({
          name: '',
          id: '',
          email: '',
          department: '',
          role: '',
          joiningDate: ''
        });
      }
    }
    if (jwtExists) {
      fetchProfile();
    }
  }, [jwtExists]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileBtnRef.current && !profileBtnRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setShowProfile(false);
    setJwtExists(false);
    window.dispatchEvent(new Event("storage"));
    navigate('/login');
  };

  const getAvatar = (name) =>
    name ? name.match(/\b\w/g).join('').toUpperCase().slice(0, 2) : "U";

  return (
    <>
      <nav className="navbar" style={{
        position: "relative", zIndex: 10, background: "#fff", boxShadow: "0 2px 20px #e0ebff26",
        padding: "0 36px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64
      }}>
        <div className="nav-links" style={{ display: "flex", gap: "31px" }}>
          <NavLink to="/employees" className={({ isActive }) => (isActive ? activeClass : 'nav-link')}>Employee Management</NavLink>
          <NavLink to="/departments" className={({ isActive }) => (isActive ? activeClass : 'nav-link')}>Department</NavLink>
          <NavLink to="/leaves" className={({ isActive }) => (isActive ? activeClass : 'nav-link')}>Leave Requests</NavLink>
          <NavLink to="/payroll" className={({ isActive }) => (isActive ? activeClass : 'nav-link')}>Payroll</NavLink>
        </div>
        {jwtExists && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            
            <div ref={profileBtnRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowProfile(v => !v)}
                style={{
                  border: "none", background: "none", borderRadius: "50%",
                  height: 44, width: 44, cursor: "pointer", marginTop: 2, display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}
                aria-label="User Profile"
              >
                <span style={{
                  display: "inline-block", width: 36, height: 36,
                  borderRadius: "50%", background: "#ebeef2", fontSize: 21,
                  color: "#32467c", textAlign: "center", lineHeight: "38px", fontWeight: 700
                }}>{getAvatar(profile.name)}</span>
              </button>
              {showProfile && (
                <div
                  style={{
                    position: 'absolute', right: 0, top: 50, minWidth: 230,
                    background: "#fff", borderRadius: 13, boxShadow: "0 5px 18px #23247a12",
                    padding: 22, zIndex: 1001, border: "1.5px solid #e8ebf4"
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: 9 }}>
                    <span style={{
                      display: "inline-block", width: 51, height: 51,
                      background: "#ccdbff", color: "#3b4aba", borderRadius: "50%",
                      fontSize: 25, lineHeight: "51px", fontWeight: 700,
                      boxShadow: "0 2px 12px #c9dafc2e", marginBottom: 4
                    }}>{getAvatar(profile.name)}</span>
                    {/* //Profile code */}
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{profile.name || 'No Name'}</div>
                    <div style={{ color: "#6f7bad", fontSize: 14, marginBottom: 4 }}>{profile.email || 'email not found'}</div>
                    <div style={{ color: "#99a0b7", fontSize: 12 }}>User ID: {profile.id}</div>
                    <div style={{ color: "#99a0b7", fontSize: 12, marginTop: 3 }}>Department: {profile.department}</div>
                    <div style={{ color: "#99a0b7", fontSize: 12 }}>Role: {profile.role}</div>
                    <div style={{ color: "#99a0b7", fontSize: 12 }}>Joined: {profile.joiningDate}</div>
                  </div>
                  <hr style={{ margin: "12px 0 14px 0", border: "none", borderTop: "1.3px solid #e2e5f5" }} />
                  <button
                    style={{
                      width: "100%", background: "#eaeaff", color: "#2d378a",
                      border: "none", fontWeight: 600, fontSize: 15, padding: "9px 0",
                      borderRadius: 8, cursor: "pointer", marginBottom: 4
                    }}
                    onClick={() => setShowProfileModal(true)}
                  >
                    View Profile
                  </button>
                  <button
                    style={{
                      width: "100%", background: "#fff", color: "#c0392b",
                      border: "1.5px solid #ffebe7", fontWeight: 700, fontSize: 15,
                      marginTop: 7, padding: "9px 0", borderRadius: 8, cursor: "pointer"
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <ProfileModal profile={profile} open={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </>
  );
}

export default Navbar;
