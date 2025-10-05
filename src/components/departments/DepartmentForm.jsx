import React, { useState } from 'react';
import { addDepartment } from '../../services/DepartmentService';

function DepartmentForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDepartment({ name });
      setMessage('Department added successfully');
      setName('');
    } catch (error) {
      setMessage('Failed to add department');
    }
  };

  return (
    <div>
      <h2>Add Department</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <button type="submit">Add Department</button>
      </form>
    </div>
  );
}

export default DepartmentForm;
