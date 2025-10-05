import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const cardBg = "linear-gradient(120deg, #e0e8ff 0%, #f6f9fc 100%)";
const headingColor = "#232b5b";
const valueColor = "#072786ff";
const labelColor = "#677184";

function SalaryView() {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [salaryDetails, setSalaryDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSalaryDetails() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/payrolls/${employeeId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("No salary found (or Unauthorized)");
        const data = await res.json();
        setSalaryDetails(data);
        setError("");
      } catch (err) {
        setError("Failed to load salary details.");
        setSalaryDetails(null);
      }
    }
    if (employeeId) fetchSalaryDetails();
  }, [employeeId]);

  const handleClose = () => {
    navigate("/payroll"); // Change this path if needed
  };

  if (error)
    return (
      <div style={{ padding: 40 }}>
        <div
          style={{
            background: "#ffe0eb",
            padding: "14px 22px",
            borderRadius: 10,
            color: "#c0392b",
            fontWeight: 700,
            fontSize: 20,
            boxShadow: "0 6px 24px #f9d3dd77",
          }}
        >
          {error}
        </div>
      </div>
    );
  if (!salaryDetails)
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        <div
          className="loader"
          style={{
            margin: "0 auto 18px",
            border: "6px solid #c9eaff",
            borderTop: "6px solid #457efa",
            borderRadius: "50%",
            width: 36,
            height: 36,
            animation: "spin 1.1s linear infinite",
          }}
        />
        <div style={{ color: valueColor, fontSize: 18, letterSpacing: 2 }}>
          Loading salary details...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', 'Segoe UI', Verdana, Geneva, sans-serif",
        background: "#f6f9fc",
      }}
    >
      <div
        style={{
          background: cardBg,
          borderRadius: 10,
          padding: "18px 36px 26px 26px",
          boxShadow: "0 0px 10px 0 rgba(10, 11, 14, 0.34)",
          height:230,
          minWidth: 500,
          maxWidth: "100%",
          // margin: "36px auto",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "transparent",
            border: "none",
            fontSize: 34,
            fontWeight: "bold",
            color: "#888",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            userSelect: "none",
          }}
          aria-label="Close"
          title="Close"
        >
          &times;
        </button>

        <h2
          style={{
            textAlign: "center",
            marginBottom:10,
            letterSpacing: 2,
            fontWeight: 800,
            color: headingColor,
            fontSize: 20,
            lineHeight: 1.2,
          }}
        >
          Salary Details
        </h2>

        {/* Base Salary */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 27 }}>
          <span
            style={{
              fontWeight: 600,
              color: labelColor,
              fontSize: 16,
              flexBasis: 160,
            }}
          >
            Base Salary:
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: valueColor,
              padding: "5px 18px",
              // background: "rgba(87, 140, 255, 0.38)",    
              marginLeft: 10,
              letterSpacing: "1px",
            }}
          >
            ₹{salaryDetails.baseSalary?.toLocaleString()}
          </span>
        </div>

        {/* Bonus */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 27 }}>
          <span
            style={{
              fontWeight: 600,
              color: labelColor,
              fontSize: 16,
              flexBasis: 160,
            }}
          >
            Bonus:
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "#0a3d8aff",
              // background: "rgba(33, 174, 240, 0.38)",
              padding: "5px 18px",
             
              marginLeft: 10,
            }}
          >
            ₹{salaryDetails.bonus?.toLocaleString()}
          </span>
        </div>

        {/* Salary Month */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 27 }}>
          <span
            style={{
              fontWeight: 600,
              color: labelColor,
              fontSize: 16,
              flexBasis: 160,
            }}
          >
            Salary Month:
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: 16,
              // background: "linear-gradient(90deg,#91caf7 10%,#fcdff2 94%)",
              color:"#0a3d8aff",
              padding:10,
              
              marginLeft: 10,
            }}
          >
            {salaryDetails.salaryMonth &&
              new Date(salaryDetails.salaryMonth).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SalaryView;
