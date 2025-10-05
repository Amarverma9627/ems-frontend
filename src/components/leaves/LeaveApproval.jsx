import React, { useEffect, useState } from "react";
import { getPendingLeaves, approveLeave, rejectLeave, deleteLeave, updateLeave } from "../../services/LeaveService";
import { useNavigate } from "react-router-dom";

const customFont = "'Poppins', 'Segoe UI', Verdana, Geneva, sans-serif'";

function LeaveApproval() {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState("fromDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 7;

  const [confirmState, setConfirmState] = useState({ show: false, action: "", leaveId: null });
  const [editLeave, setEditLeave] = useState(null);
  const [viewLeave, setViewLeave] = useState(null);
  const [editForm, setEditForm] = useState({ fromDate: "", toDate: "", reason: "" });

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  async function fetchLeaves() {
    try {
      const query = statusFilter ? `?status=${statusFilter.toUpperCase()}` : "";
      const res = await getPendingLeaves(query);
      setLeaves(res.data || []);
    } catch (error) {
      setLeaves([]);
      console.error("Failed to fetch leaves", error);
    }
  }

  function openConfirmDialog(action, leaveId) {
    setConfirmState({ show: true, action, leaveId });
  }
  function closeConfirmDialog() {
    setConfirmState({ show: false, action: "", leaveId: null });
  }
  async function handleConfirmAction() {
    try {
      if (confirmState.action === "approve") await approveLeave(confirmState.leaveId);
      else if (confirmState.action === "reject") await rejectLeave(confirmState.leaveId);
      else if (confirmState.action === "delete") await deleteLeave(confirmState.leaveId);
      await fetchLeaves();
    } catch (error) {
      console.error(`Failed to ${confirmState.action} leave`, error);
    }
    closeConfirmDialog();
  }

  function openEditModal(leave) {
    setEditLeave(leave);
    setEditForm({ fromDate: leave.fromDate, toDate: leave.toDate, reason: leave.reason });
  }
  function closeEditModal() {
    setEditLeave(null);
  }
  async function saveEdit() {
    try {
      const payload = {
        fromDate: editForm.fromDate,
        toDate: editForm.toDate,
        reason: editForm.reason,
      };
      await updateLeave(editLeave.id, payload);
      await fetchLeaves();
      closeEditModal();
    } catch (error) {
      console.error("Failed to update leave", error);
    }
  }

  function openViewModal(leave) {
    setViewLeave(leave);
  }
  function closeViewModal() {
    setViewLeave(null);
  }

  const filteredLeaves = leaves
    .filter(
      (leave) =>
        (!search ||
          String(leave.employee?.id ?? "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (leave.employee?.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (leave.reason ?? "").toLowerCase().includes(search.toLowerCase())) &&
        (!statusFilter || (leave.status && leave.status.toLowerCase() === statusFilter.toLowerCase()))
    )
    .sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      if (sortKey.toLowerCase().includes("date")) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredLeaves.length / pageSize));
  const leavesPage = filteredLeaves.slice((page - 1) * pageSize, page * pageSize);

  const statusBadge = (status) =>
    ({
      Pending: { background: "#ffecb3", color: "#e59400", border: "1.5px solid #ffdc7b" },
      Approved: { background: "#c9f7e3", color: "#079369", border: "1.5px solid #76eac6" },
      Rejected: { background: "#ffe0e6", color: "#e23c61", border: "1.5px solid #ff90ae" },
    }[status] || { background: "#eeeeee", color: "#222", border: "1.5px solid #bbb" });

  const handleSort = (key) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div style={{ minWidth:"100%",minHeight: "100vh", background: "linear-gradient(120deg, #e3e9ff 0%, #e6f7ff 100%)", fontFamily: customFont, padding: "24px 0" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "30px auto",
          background: "white",
          borderRadius: 20,
          padding: 40,
          boxShadow: "0 8px 40px rgba(50, 100, 180, 0.15)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
          <h1 style={{ color: "#25396f", fontWeight: "600", fontSize: "20px", fontFamily: customFont }}>Leave Approvals</h1>
          <button
            onClick={() => navigate("/leaves/request")}
            style={{
              padding: "12px 18px",
              background: "linear-gradient(90deg, #4070de, #08d6de)",
              color: "white",
              
              border: "none",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 4px 20px #91baff",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 30px #82b7ff")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px #91baff")}
          >
            + Request Leave
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          <input
            placeholder="Search by Emp ID, email or reason..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{
              padding: 10,
              width:"40%",
              borderRadius: 12,
              border: "1px solid #a2b2ec",
              // flex: "1 1 280px",
              fontSize: 14,
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4070de")}
            onBlur={(e) => (e.target.style.borderColor = "#a2b2ec")}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1.5px solid #a2b2ec",
              fontSize: 14,
              flex: "0 0 200px",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4070de")}
            onBlur={(e) => (e.target.style.borderColor = "#a2b2ec")}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
            }}
            style={{
              padding: "12px 18px",
              background: "#ecf2ff",
              color: "#226bc8",
              border: "none",
              fontWeight: "600",
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 3px 15px #acd5ff",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c7dbff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ecf2ff")}
          >
            Clear Filters
          </button>
        </div>

        <div style={{ overflowX: "auto", borderRadius: 20, boxShadow: "0 2px 15px rgba(33, 90, 200, 0.15)", backgroundColor: "#f7faff" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px", fontSize: 12 }}>
            <thead>
              <tr style={{ color: "#4165b3", fontWeight: 700 ,padding: "0px 5px"}}>
                <th style={{ padding: "0px 5px", textAlign: "center"}}>Emp_ID</th>
                <th style={{ padding: "0px 5px", textAlign: "center" }}>Email</th>
                <th style={{ padding: "0px 10px", textAlign: "center" }}>From Date</th>
                <th style={{ padding: "15px 10px", textAlign: "center" }}>To Date</th>
                <th style={{ padding: "15px 100px", textAlign: "center" }}>Reason</th>
                <th style={{ padding: "0px 5px", textAlign: "center" }}>Status</th>
                <th style={{ padding: "0px 10px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leavesPage.length ? (
                leavesPage.map((leave, idx) => (
                  <tr
                    key={leave.id}
                    style={{
                      backgroundColor: "white",
                      boxShadow: "0 0px 5px rgb(73 108 179 / 40%)",
                      borderRadius: 18,
                      margin: "10px 0",
                      display: "table-row",
                    }}
                  >
                    <td style={{ padding: "18px 10px", textAlign: "center", borderRadius: "18px 0 0 18px", fontWeight: 700, color: "#226bc8" }}>{leave.employee?.id}</td>
                    <td style={{ padding: "18px 10px", textAlign: "center", color: "#466eb9", fontWeight: 600 }}>{leave.employee?.email}</td>
                    <td style={{ padding: "18px 10px", textAlign: "center" }}>{leave.fromDate}</td>
                    <td style={{ padding: "18px 10px", textAlign: "center" }}>{leave.toDate}</td>
                    <td style={{ padding: "18px 10px", textAlign: "center" }}>{leave.reason}</td>
                    <td style={{ padding: "18px 10px", textAlign: "center" }}>
                      <span
                        style={{
                          padding: "5px 12px",
                          // borderRadius: 18,
                          fontWeight: 200,
                          letterSpacing:0.2,
                          // color: statusBadge(leave.status).color,
                          backgroundColor: statusBadge(leave.status).background,
                          // border: statusBadge(leave.status).border,
                          display: "inline-block",
                          boxShadow: "0 4px 12px rgb(127 165 255 / 40%)",
                          textTransform: "uppercase",
                        }}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td style={{ padding: "18px 10px", textAlign: "center", borderRadius: "0 18px 18px 0" }}>
                      {leave.status && leave.status.toLowerCase() === "pending" ? (
                        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                          <button onClick={() => openConfirmDialog("approve", leave.id)} style={actionBtnStyle.greenButton}>
                            Approve
                          </button>
                          <button onClick={() => openConfirmDialog("reject", leave.id)} style={actionBtnStyle.redButton}>
                            Reject
                          </button>
                          {/* <button onClick={() => openEditModal(leave)} style={actionBtnStyle.orangeButton}>
                            Edit
                          </button>
                          <button onClick={() => openViewModal(leave)} style={actionBtnStyle.blueButton}>
                            View
                          </button> */}
                          <button onClick={() => openConfirmDialog("delete", leave.id)} style={actionBtnStyle.deleteButton}>
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: "#90a", fontWeight: 600, fontSize: 15 }}>No Actions</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#c4113a", padding: 28, fontWeight: 700, fontSize: 18 }}>
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 28, gap: 16 }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{
              ...paginationBtnStyle,
              opacity: page === 1 ? 0.5 : 1,
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            &lt; Prev
          </button>
          <p style={{ alignSelf: "center", color: "#495", fontWeight: 600, fontSize: 17, margin: 0 }}>
            Page {page} of {totalPages}
          </p>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{
              ...paginationBtnStyle,
              opacity: page === totalPages ? 0.5 : 1,
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next &gt;
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmState.show && <ConfirmDialog action={confirmState.action} onCancel={closeConfirmDialog} onConfirm={handleConfirmAction} />}

      {/* Edit Modal */}
      {editLeave && <EditLeaveModal leave={editLeave} form={editForm} setForm={setEditForm} onClose={closeEditModal} onSave={saveEdit} />}

      {/* View Modal */}
      {viewLeave && <ViewLeaveModal leave={viewLeave} onClose={closeViewModal} />}
    </div>
  );
}

const ConfirmDialog = ({ action, onCancel, onConfirm }) => {
  const actionName = action.charAt(0).toUpperCase() + action.slice(1);
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContainerStyle}>
        <h3 style={{color:"red"}}>{actionName} Confirmation</h3>
        <p>Are you sure you want to {action} this leave request?</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12,marginTop:20  }}>
          <button onClick={onCancel} style={actionBtnStyle.redButton}>
            Cancel
          </button>
          <button onClick={onConfirm} style={actionBtnStyle.greenButton}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const EditLeaveModal = ({ leave, form, setForm, onClose, onSave }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContainerStyle}>
        <h3>Edit Leave Request</h3>
        <label style={{ marginTop: 10, display: "block" }}>
          From:
          <input type="date" name="fromDate" value={form.fromDate} onChange={handleChange} />
        </label>
        <label style={{ marginTop: 10, display: "block" }}>
          To:
          <input type="date" name="toDate" value={form.toDate} onChange={handleChange} />
        </label>
        <label style={{ marginTop: 10, display: "block" }}>
          Reason:
          <textarea name="reason" value={form.reason} onChange={handleChange} rows={4} style={{ width: "100%", marginTop: 6 }} />
        </label>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={actionBtnStyle.redButton}>
            Cancel
          </button>
          <button onClick={onSave} style={actionBtnStyle.greenButton}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewLeaveModal = ({ leave, onClose }) => (
  <div style={modalOverlayStyle}>
    <div style={modalContainerStyle}>
      <h3>Leave Details</h3>
      <p>
        <strong>Employee ID:</strong> {leave.employee?.id}
      </p>
      <p>
        <strong>Email:</strong> {leave.employee?.email}
      </p>
      <p>
        <strong>From:</strong> {leave.fromDate}
      </p>
      <p>
        <strong>To:</strong> {leave.toDate}
      </p>
      <p>
        <strong>Reason:</strong> {leave.reason}
      </p>
      <p>
        <strong>Status:</strong> {leave.status}
      </p>
      <button onClick={onClose} style={{ marginTop: 20, padding: "10px 30px", borderRadius: 5, backgroundColor: "#4070de", color: "white", border: "none", cursor: "pointer" }}>
        Close
      </button>
    </div>
  </div>
);

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContainerStyle = {
  backgroundColor: "white",
  fontSize:12,
  borderRadius: 10,
  padding: 35,
  width: 400,
  maxWidth: "90%",
  boxShadow: "0 5px 30px rgba(0,0,0,0.3)",
};

const actionBtnStyle = {
  greenButton: {
    background: "linear-gradient(90deg,#00e99e,#09c377)",
    color: "white",
    border: "none",
    borderRadius: 3,
    padding: "7px 10px",
    fontWeight: 700,
    marginRight: 3,
 
    fontSize: 12,
    cursor: "pointer",
    boxShadow: "0 2px 6px #b4fcdc",
  },
  redButton: {
    background: "linear-gradient(90deg,#ff4170,#fe8657)",
    color: "white",
    border: "none",
    borderRadius:3,
    padding: "7px 10px",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
    boxShadow: "0 2px 6px #fca3bd",
  },
  orangeButton: {
    background: "linear-gradient(90deg,#ff9f3f,#ff7f50)",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "7px 16px",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 2px 6px #fba94a",
  },
  blueButton: {
    background: "linear-gradient(90deg,#6096fd,#2a52be)",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "7px 16px",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 2px 6px #5d75ff",
  },
};

const paginationBtnStyle = {
  color: "#2468c8",
  background: "#f5f8ff",
  border: "1.6px solid #bdd2f1",
  borderRadius: 8,
  padding: "11px 30px",
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer",
  transition: "background 0.22s",
  marginBottom: 6,
};

const statusBadge = (status) =>
  ({
    Pending: { background: "#ffecb3", color: "#e59400", border: "1.5px solid #ffdc7b" },
    Approved: { background: "#c9f7e3", color: "#079369", border: "1.5px solid #76eac6" },
    Rejected: { background: "#ffe0e6", color: "#e23c61", border: "1.5px solid #ff90ae" },
  }[status] || { background: "#eeeeee", color: "#222", border: "1.5px solid #bbb" });

export default LeaveApproval;
