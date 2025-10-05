import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEmployeeById } from '../../services/EmployeeService';

function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployeeById(id)
      .then(response => {
        setEmployee(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch employee details', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>Employee not found.</div>;
  }

  return (
    <div className="employee-details-container">
      <h2>Employee Details</h2>
      <p><strong>Name:</strong> {employee.firstName} {employee.lastName}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Department:</strong> {employee.department}</p>
      <p><strong>Salary:</strong> {employee.salary}</p>
      {/* Extend with more details like attendance, leaves etc. */}
      <Link to="/employees">Back to Employee List</Link>
    </div>
  );
}

export default EmployeeDetails;
