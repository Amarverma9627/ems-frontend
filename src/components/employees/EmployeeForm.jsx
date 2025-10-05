import React, { useState } from 'react';
import { addEmployee } from '../../services/EmployeeService';

function EmployeeForm() {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    salary: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmployee(employee);
      setMessage('Employee added successfully');
      setEmployee({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        salary: ''
      });
    } catch (error) {
      setMessage('Failed to add employee');
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={employee.firstName}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={employee.lastName}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={employee.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={employee.department}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={employee.salary}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
}

export default EmployeeForm;
