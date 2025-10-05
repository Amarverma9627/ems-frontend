import React from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

import EmployeeList from './components/employees/EmployeeList';
import EmployeeForm from './components/employees/EmployeeForm';
import EmployeeProfile from './components/employees/EmployeeProfile';
import EmployeeDetails from './components/employees/EmployeeDetails';

import DepartmentList from './components/departments/DepartmentList';
import DepartmentForm from './components/departments/DepartmentForm';

import LeaveApproval from './components/leaves/LeaveApproval';
import LeaveRequest from './components/leaves/LeaveRequestForm';

import UserProfile  from "./components/common/ProfileModal"
import PayrollList from './components/payroll/PayrollSummary';   // Assuming ye components hain
import PayrollForm from './components/payroll/SalaryView';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
    const location = useLocation();
    
     // routes where you want navbar HIDDEN
  const hideNavbarRoutes = ['/login', '/signup', '/reset-password'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);
  const isAuthenticated = !!localStorage.getItem('jwtToken');

  return (
    <>
       {!hideNavbar && <Navbar />}
      {/* {isAuthenticated && <Navbar />} */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Employee Routes */}
        <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
        <Route path="/employees/add" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
        <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />
        <Route path="/employees/:id" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />

        {/* Department Routes */}
        <Route path="/departments" element={<ProtectedRoute><DepartmentList /></ProtectedRoute>} />
        <Route path="/departments/add" element={<ProtectedRoute><DepartmentForm /></ProtectedRoute>} />

        {/* Leaves Routes */}
         <Route path='/leaves' element={<ProtectedRoute><LeaveApproval /></ProtectedRoute>} />
            <Route path='/leaves/request' element={<ProtectedRoute><LeaveRequest /></ProtectedRoute>} />
        {/* profileModel */}
        <Route path="/profile" element={<UserProfile />} />

        {/* Payroll Routes */}
        <Route path="/payroll" element={<ProtectedRoute><PayrollList /></ProtectedRoute>} />
        <Route path="/salary/:employeeId" element={<ProtectedRoute><PayrollForm /></ProtectedRoute>} />

        {/* Unknown Routes redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/employees" : "/login"} />} />
      </Routes>
      {isAuthenticated && <Footer />}
    </>
  );
}

export default App;
