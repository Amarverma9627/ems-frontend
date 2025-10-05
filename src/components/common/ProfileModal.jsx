import React from 'react';

function ProfileModal({ profile, open, onClose }) {
  if (!open || !profile) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(43,55,93,0.18)", zIndex: 5001,
      display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 17, boxShadow: "0 5px 22px #23247a45",
        minWidth: 340, maxWidth: "95vw", padding: 32
      }}>
        <div style={{ textAlign: "center" }}>
          <span style={{
            display: "inline-block", width: 68, height: 68, background: "#ccdbff",
            color: "#3b4aba", borderRadius: "50%",
            fontSize: 33, fontWeight: 700, boxShadow: "0 2px 12px #c9dafc2e", marginBottom: 12,
            lineHeight: "68px"
          }}>{profile?.name ? profile.name.match(/\b\w/g).join('').toUpperCase().slice(0,2) : "U"}</span>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{profile?.name || 'No Name'}</div>
          <div style={{ color: "#6f7bad", fontSize: 16, marginBottom: 9 }}>{profile?.email || 'email not found'}</div>
        </div>
        <table style={{ width: "100%", fontSize: 15, color: "#33449a" }}>
          <tbody>
            <tr><td>User ID:</td><td>{profile?.id || 'N/A'}</td></tr>
            <tr><td>Department:</td><td>{profile?.department || 'N/A'}</td></tr>
            <tr><td>Role:</td><td>{profile?.role || 'N/A'}</td></tr>
            <tr><td>Joining Date:</td><td>{profile?.joiningDate || 'N/A'}</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: 22, textAlign: "center" }}>
          <button onClick={onClose}
            style={{
              background: "#eaeaff", color: "#2d378a", fontWeight: 600,
              border: "none", fontSize: 16, padding: "9px 36px", borderRadius: 9,
              cursor: "pointer"
            }}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
