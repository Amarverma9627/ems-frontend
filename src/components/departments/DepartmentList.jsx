import React, { useState, useEffect } from "react";
import axios from "axios";

function DepartmentList() {
  const [employees, setEmployees] = useState([]);
  const [expandedDepts, setExpandedDepts] = useState({});
  const [searchDept, setSearchDept] = useState('');
  const [searchEmp, setSearchEmp] = useState('');

  // Fetch employees from DB (each employee has department field)
  useEffect(() => {
    axios.get('http://localhost:8080/api/employees')
      .then(res => setEmployees(Array.isArray(res.data) ? res.data : []))
      .catch(() => setEmployees([]));
  }, []);

  // Build department list from employee data
  const allDepartments = [
    ...new Set(
      employees
        .map(emp => emp.department?.trim())
        .filter(dep => dep && dep.length > 0)
    )
  ];

  // Filter for search
  const filteredDepts = allDepartments.filter(dep =>
    dep.toLowerCase().includes(searchDept.toLowerCase())
  );

  // When you expand a department, show all employees for it
  return (
    <div style={{ maxWidth: 960, margin: '20px auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana" }}>
      <h1 style={{ textAlign: 'center', marginBottom:10, color: '#004d99', fontSize: 20 }}>
        Department & Employee Groups
      </h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: 12 }}>
        <input
          placeholder="Search Departments"
          value={searchDept}
          onChange={e => setSearchDept(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: '2px solid #007acc', width: 280 }}
        />
      </div>
      {filteredDepts.length === 0 && <p style={{ textAlign: 'center' ,fontSize:20}}>No departments found.</p>}
      {filteredDepts.map(depName => {
        const isExpanded = !!expandedDepts[depName];
        // Employees in this department, filtered by searchEmp
        const deptEmployees = employees.filter(emp =>
          emp.department &&
          emp.department.trim().toLowerCase() === depName.trim().toLowerCase() &&
          (
            emp.firstName?.toLowerCase().includes(searchEmp.toLowerCase()) ||
            emp.lastName?.toLowerCase().includes(searchEmp.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchEmp.toLowerCase())
          )
        );
        return (
          <div key={depName} style={{ border: '2px solid #007acc', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div
              style={{
                cursor: 'pointer',
                color: '#007acc',
                fontWeight: 'bold',
                fontSize: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onClick={() => setExpandedDepts(prev => ({ ...prev, [depName]: !prev[depName] }))}
            >
              <span>
                {isExpanded ? '▼' : '▶'} {depName} ({deptEmployees.length})
              </span>
            </div>
            {isExpanded && (
              <>
                <input
                  placeholder="Search Employees"
                  value={searchEmp}
                  onChange={e => setSearchEmp(e.target.value)}
                  style={inputStyle}
                />
                {deptEmployees.length === 0 ? (
                  <p style={{ marginTop: 12, color: '#777' }}>No employees match the filter.</p>
                ) : (
                  <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse", background: "#f8fbff", borderRadius: 7 }}>
                    <thead>
                      <tr style={{ backgroundColor:"#f5c731ff" , fontWeight: 700, fontSize: 16 }}>
                        <th style={empTableCell}>Name</th>
                        <th style={empTableCell}>Email</th>
                        <th style={empTableCell}>Department</th>
                        <th style={empTableCell}>Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deptEmployees.map(emp => (
                        <tr key={emp.id} style={{ background: "#dadad7ff", fontSize: 15 }}>
                          <td style={empTableCell}>{emp.firstName} {emp.lastName}</td>
                          <td style={empTableCell}>{emp.email}</td>
                          <td style={empTableCell}>{emp.department}</td>
                          <td style={empTableCell}>{emp.salary ? `₹${Number(emp.salary).toLocaleString()}` : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Style objects
const inputStyle = { width: '100%', padding: '10px 14px', fontSize: 16, borderRadius: 6, border: '2px solid #cbd5e0', marginBottom: 16, outlineOffset: 2 };
const empTableCell = { padding: "10px 8px", borderBottom: "1px solid #d4e6fd", textAlign: "left" };

export default DepartmentList;
