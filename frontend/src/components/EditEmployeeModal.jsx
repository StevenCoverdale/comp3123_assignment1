import React, { useState } from "react";

export default function EditEmployeeModal({ employee, onClose, onSave }) {
    const [form, setForm] = useState({
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        email: employee.email || "",
        department: employee.department || "",
        position: employee.position || "",
    });

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form, file);
    };

    return (
        <div style={overlay}>
            <div style={modal}>
                <h2>{employee._id ? "Edit Employee" : "Add Employee"}</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        name="first_name"
                        placeholder="First Name"
                        value={form.first_name}
                        onChange={handleChange}
                        style={input}
                        required
                    />

                    <input
                        name="last_name"
                        placeholder="Last Name"
                        value={form.last_name}
                        onChange={handleChange}
                        style={input}
                        required
                    />

                    <input
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        style={input}
                        required
                    />

                    <input
                        name="department"
                        placeholder="Department"
                        value={form.department}
                        onChange={handleChange}
                        style={input}
                        required
                    />

                    <input
                        name="position"
                        placeholder="Position"
                        value={form.position}
                        onChange={handleChange}
                        style={input}
                        required
                    />

                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ marginBottom: "15px" }}
                    />

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button type="submit" style={saveButton}>Save</button>
                        <button type="button" onClick={onClose} style={cancelButton}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ------------------ Styles ------------------ */

const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const modal = {
    background: "white",
    padding: "25px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
};

const input = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
};

const saveButton = {
    padding: "10px 16px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
};

const cancelButton = {
    padding: "10px 16px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
};