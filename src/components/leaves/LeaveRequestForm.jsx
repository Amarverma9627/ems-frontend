import React, { useEffect, useState } from 'react';
import { getEmployees, addLeave } from '../../services/LeaveService';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: 400,
    margin: '5px auto',
    padding:15,
    borderRadius: 15,
    background: 'linear-gradient(135deg, #fff, #f0f4ff)',
    fontFamily: "'Poppins', sans-serif",
    boxShadow: '0 0px 30px rgba(102, 140, 255, 0.2)',
    color: '#224b8b',
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 0,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 15,
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px 15px',
    borderRadius: 8,
    border: '1.5px solid #7a9aff',
    fontSize: 18,
    boxSizing: 'border-box',
    marginTop:3,
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  textarea: {
    minHeight: 50,
    resize: 'vertical',
  },
 buttonPrimary: {
  width: '30%',
  padding: '7px',
  marginTop: 10,
  borderRadius: 0,
  border: 'none',
  background: 'linear-gradient(90deg, #f3ca15ff)',
  color: 'white',
  fontWeight: '700',
  fontSize: 20,
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(102, 140, 255, 0.6)',
  transition: 'background 0.3s ease',
}
,
  buttonSecondary: {
    width: '30%',
    padding: '8px',
    margin:40,
    marginTop: 20,
    border: 'none',
    background: '#b8b7b1ff',
    color: '#555',
    fontWeight: '600',
    fontSize: 18,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  messageSuccess: {
    color: '#27ae60',
    fontWeight: '700',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 17,
  },
  messageError: {
    color: '#e74c3c',
    fontWeight: '700',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 17,
  },
};

function LeaveRequest({ onClose }) {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [form, setForm] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await getEmployees();
        setEmployees(response.data);
        if (response.data.length > 0) {
          setSelectedEmployeeId(response.data[0].id);
        }
      } catch (err) {
        setMessage('Failed to load employee list');
      }
    }
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployeeId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await addLeave({
        employee: { id: selectedEmployeeId },
        fromDate: form.fromDate,
        toDate: form.toDate,
        reason: form.reason,
      });
      setMessage('Leave request submitted successfully!');
      setForm({ fromDate: '', toDate: '', reason: '' });

      navigate('/leaves/approval');  // Redirect to Leave Approval page on success

    } catch (err) {
      setMessage('Failed to submit leave request');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Leave Request Form</h2>
      {message && (
        <p style={message.includes('Failed') ? styles.messageError : styles.messageSuccess}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>
          Select Employee:
          <select value={selectedEmployeeId} onChange={handleEmployeeChange} style={styles.input} required>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.id} - {emp.email}
              </option>
            ))}
          </select>
        </label>
        <label style={styles.label}>
          From:
          <input type="date" name="fromDate" value={form.fromDate} onChange={handleInputChange} style={styles.input} required />
        </label>
        <label style={styles.label}>
          To:
          <input type="date" name="toDate" value={form.toDate} onChange={handleInputChange} style={styles.input} required />
        </label>
        <label style={styles.label}>
          Reason:
          <textarea name="reason" value={form.reason} onChange={handleInputChange} style={{ ...styles.input, ...styles.textarea }} required />
        </label>
        <button type="button" onClick={onClose} style={styles.buttonSecondary}>
          Cancel
        </button>
        <button type="submit" disabled={loading} style={styles.buttonPrimary}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default LeaveRequest;
