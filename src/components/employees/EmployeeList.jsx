import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee, addEmployee, updateEmployee } from '../../services/EmployeeService';
import { CSVLink } from "react-csv";
import '../../components/employees/EmployeeList.css';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [viewEmp, setViewEmp] = useState(null);
  const [editEmp, setEditEmp] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', department: '', salary: '' });
  const [search, setSearch] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [salaryRange, setSalaryRange] = useState({ min: '', max: '' });
  const [sortKey, setSortKey] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const pageSize = 5;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      alert('No employees selected');
      return;
    }
    if (window.confirm('Are you sure you want to delete selected employees?')) {
      try {
        for (let id of selectedIds) {
          await deleteEmployee(id);
        }
        setSelectedIds(new Set());
        setSelectAll(false);
        fetchEmployees();
      } catch (error) {
        console.error('Failed to bulk delete employees', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        console.error('Failed to delete employee', error);
      }
    }
  };

  const openForm = (emp = null) => {
    setEditEmp(emp);
    setForm(emp ? { ...emp } : { firstName: '', lastName: '', email: '', department: '', salary: '' });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editEmp) {
        await updateEmployee(editEmp.id, form);
      } else {
        // Salary number mein send karna zaruri hai
        const newEmployeeData = { ...form, salary: Number(form.salary) };
        await addEmployee(newEmployeeData);
      }
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      alert('Failed to save employee');
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pageData.map(emp => emp.id)));
    }
    setSelectAll(!selectAll);
  };

  const toggleCheckbox = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const changeSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sortedEmployees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const searchStr = search.toLowerCase();
    if (!fullName.includes(searchStr) && !emp.email.toLowerCase().includes(searchStr)) {
      return false;
    }
    if (searchDept && emp.department.toLowerCase() !== searchDept.toLowerCase()) {
      return false;
    }
    if (salaryRange.min && emp.salary < Number(salaryRange.min)) {
      return false;
    }
    if (salaryRange.max && emp.salary > Number(salaryRange.max)) {
      return false;
    }
    return true;
  });

  const pageCount = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleView = (emp) => {
    setViewEmp(emp);
    setShowView(true);
  };

  return (
    <div className="emp-container">
      <h2>Employee List</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by department..."
          value={searchDept}
          onChange={e => setSearchDept(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Salary"
          value={salaryRange.min}
          onChange={e => setSalaryRange(s => ({ ...s, min: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Max Salary"
          value={salaryRange.max}
          onChange={e => setSalaryRange(s => ({ ...s, max: e.target.value }))}
        />
        <button onClick={() => {
          setSearch('');
          setSearchDept('');
          setSalaryRange({ min: '', max: '' });
        }} style={{padding:5}}>Clear Filters</button>
      </div>

      <div className="emp-bar">
        <button className="add-btn" onClick={() => openForm()}>Add Employee</button>
        <button className="bulk-delete-btn" onClick={handleBulkDelete} disabled={selectedIds.size === 0}>Delete Selected</button>
      </div>

      <table className="emp-table">
        <thead>
          <tr>
            <th><input type="checkbox" onChange={toggleSelectAll} checked={selectAll} /></th>
            <th onClick={() => changeSort('firstName')} style={{ cursor: 'pointer' }}>Name {sortKey === 'firstName' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => changeSort('email')} style={{ cursor: 'pointer' }}>Email {sortKey === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => changeSort('department')} style={{ cursor: 'pointer' }}>Department {sortKey === 'department' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => changeSort('salary')} style={{ cursor: 'pointer' }}>Salary {sortKey === 'salary' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageData.length ? pageData.map(emp => (
            <tr key={emp.id}>
              <td><input type="checkbox" checked={selectedIds.has(emp.id)} onChange={() => toggleCheckbox(emp.id)} /></td>
              <td>{emp.firstName} {emp.lastName}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.salary}</td>
              <td>
                <button className="v" onClick={() => handleView(emp)}>View</button>
                <button className="e" onClick={() => openForm(emp)}>Edit</button>
                <button className="d" onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No employees found.</td></tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>&lt; Prev</button>
        <span>Page {page} of {pageCount}</span>
        <button disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next &gt;</button>
      </div>

      {showForm && (
        <div className="emp-form-modal">
          <form className="emp-form" onSubmit={handleFormSubmit}>
            <input type="text" placeholder="First Name" value={form.firstName} required onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
            <input type="text" placeholder="Last Name" value={form.lastName} required onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
            <input type="email" placeholder="Email" value={form.email} required onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input type="text" placeholder="Department" value={form.department} required onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
            <input type="number" placeholder="Salary" value={form.salary} required onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button type="submit">{editEmp ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showView && (
        <div className="emp-view-modal">
          <div className="emp-view-content">
            <button className="modal-close-btn" onClick={() => setShowView(false)}>×</button>
            <h3>Employee Details</h3>
            <p><strong>First Name:</strong> {viewEmp.firstName}</p>
            <p><strong>Last Name:</strong> {viewEmp.lastName}</p>
            <p><strong>Email:</strong> {viewEmp.email}</p>
            <p><strong>Department:</strong> {viewEmp.department}</p>
            <p><strong>Salary:</strong> {viewEmp.salary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
