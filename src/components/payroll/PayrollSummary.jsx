import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const customFont = "'Poppins', 'Segoe UI', Verdana, Geneva, sans-serif'";

async function getEmployees() {
  const res = await fetch("http://localhost:8080/api/employees");
  if (!res.ok) throw new Error("Failed to fetch employees");
  return await res.json();
}

async function getPayrollSummary() {
  const token = localStorage.getItem("token"); // JWT token assume kar ke
  const res = await fetch("http://localhost:8080/api/payrolls", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch payroll summary");
  return await res.json();
}

async function addPayroll(payroll) {
  const token = localStorage.getItem("token"); // token jo login ke baad mila
  const res = await fetch("http://localhost:8080/api/payrolls", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payroll),
  });
  if (!res.ok) throw new Error("Failed to add payroll");
  return await res.json();
}

export default function PayrollSummary() {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employeeId: "",
    baseSalary: "",
    bonus: "",
    salaryMonth: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [emps, pays] = await Promise.all([getEmployees(), getPayrollSummary()]);
        setEmployees(emps);
        setPayrolls(pays);
        setError(null);
      } catch (e) {
        setError("Failed to load data: " + e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // New useEffect to update baseSalary as employeeId changes
  useEffect(() => {
    if (!form.employeeId) {
      // Clear baseSalary if no employee selected
      setForm((f) => ({ ...f, baseSalary: "" }));
      return;
    }
    const emp = employees.find((e) => String(e.id) === String(form.employeeId));
    setForm((f) => ({
      ...f,
      baseSalary: emp ? emp.baseSalary : "",
    }));
  }, [form.employeeId, employees]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await addPayroll({
        employeeId: Number(form.employeeId),
        baseSalary: parseFloat(form.baseSalary),
        bonus: parseFloat(form.bonus) || 0,
        salaryMonth: form.salaryMonth,
      });
      setMessage("Payroll added!");
      setForm({ employeeId: "", baseSalary: "", bonus: "", salaryMonth: "" });
      const updatedPayrolls = await getPayrollSummary();
      setPayrolls(updatedPayrolls);
    } catch (e) {
      setMessage("Failed to add payroll: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        fontFamily: customFont,
        padding: 30,
        maxWidth: 1050,
        margin: "40px auto",
        background: "#f7f7f4ff",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      }}
    >
      <h2
        style={{
          marginBottom: 20,
          fontSize: 20,
          color: "#1a2f80",
          fontWeight:600,
          textAlign: "center",
        }}
      >
        Payroll Summary
      </h2>

      {error && (
        <p style={{ color: "red", textAlign: "center", fontSize: "20px" }}>{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 35,
          background: "#eaf2ff",
          padding: 30,
          borderRadius: 15,
          boxShadow: "0 6px 16px #cbe1ff",
        }}
      >
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize:15}}>Employee</label>
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleFormChange}
              required
              style={{ width: "100%", padding: 10, fontSize: 15, borderRadius: 7 ,border:"1px solid black"}}
            >
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id} - {e.name || e.email}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize:15 }}>Base Salary</label>
            <input
              name="baseSalary"
              type="number"
              value={form.baseSalary || ""}
              onChange={handleFormChange}
              required
              disabled={!form.employeeId}
              style={{ width: "100%", padding: 10, fontSize: 16, borderRadius: 7 ,border:"1px solid black"}}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{fontSize:15}}>Bonus</label>
            <input
              name="bonus"
              type="number"
              value={form.bonus || ""}
              onChange={handleFormChange}
              style={{ width: "100%", padding: 10, fontSize: 16, borderRadius: 7,border:"1px solid black" }}
              placeholder="0"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize:15 }}>Salary Month</label>
            <input
              name="salaryMonth"
              type="date"
              value={form.salaryMonth || ""}
              onChange={handleFormChange}
              required
              style={{ width: "100%", padding: 10, fontSize: 16, borderRadius: 7,border:"1px solid black" }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 22,
            padding: "10px 25px",
           
            border: "none",
            background: "linear-gradient(90deg, #3769cc, #1e95e6)",
            color: "#fff",
            fontWeight: 400,
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 3px 9px #b1d9ff",
          }}
        >
          {loading ? "Saving..." : "Add Payroll"}
        </button>

        {message && (
          <div
            style={{
              marginTop: 14,
              fontWeight: 600,fontSize:15,
              color: message.includes("added") ? "#1a8800" : "#b21f1f",
            }}
          >
            {message}
          </div>
        )}
      </form>

      {/* Payroll table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 15,
          color: "#2c3e7a",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#c8d3f9",
              color: "#1a2f80",
              fontWeight: "700",
              fontSize: 15,
            }}
          >
            <th style={{ padding: 14, border: "2px solid #a1b2e6" }}>Employee ID</th>
            <th style={{ padding: 14, border: "2px solid #a1b2e6" }}>Base Salary</th>
            <th style={{ padding: 14, border: "2px solid #a1b2e6" }}>Bonus</th>
            <th style={{ padding: 14, border: "2px solid #a1b2e6" }}>Salary Month</th>
            <th style={{ padding: 14, border: "2px solid #a1b2e6" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!loading && payrolls.length === 0 && (
            <tr>
              <td
                colSpan={5}
                style={{ padding: 24, textAlign: "center", color: "#c0392b", fontWeight: 600 }}
              >
                No payroll data found.
              </td>
            </tr>
          )}
          {payrolls.map((payroll, index) => (
            <tr
              key={payroll.id}
              style={{ backgroundColor: index % 2 === 0 ? "#e8edff" : "#dbdbdbff" }}
            >
              <td style={{ padding: 14, textAlign: "center" }}>{payroll.employeeId}</td>
              <td style={{ padding: 14, textAlign: "right" }}>{payroll.baseSalary.toFixed(2)}</td>
              <td style={{ padding: 14, textAlign: "right" }}>{payroll.bonus.toFixed(2)}</td>
              <td style={{ padding: 14, textAlign: "center" }}>
                {new Date(payroll.salaryMonth).toLocaleDateString()}
              </td>
              <td style={{ padding: 14, textAlign: "center" }}>
                <button
                  onClick={() => navigate(`/salary/${payroll.employeeId}`)}
                  style={{
                    backgroundColor: "#273fa0ff",
                    color: "#fff",
                    border: "none",
                  
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  View Salary
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
