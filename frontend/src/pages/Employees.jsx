import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Employees() {
    const queryClient = useQueryClient();

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { data: employees, isLoading } = useQuery({
        queryKey: ["employees", search],
        queryFn: () => {
            if (!search.trim()) {
                return axiosClient.get("/emp/employees").then((res) => res.data);
            }
            return axiosClient
                .get("/emp/employees/search", { params: { query: search } })
                .then((res) => res.data);
        },
    });

    const createEmployee = useMutation({
        mutationFn: (formData) =>
            axiosClient.post("/emp/employees", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
            setIsEditOpen(false);
        },
    });

    const updateEmployee = useMutation({
        mutationFn: ({ eid, data }) =>
            axiosClient.put(`/emp/employees/${eid}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
            setIsEditOpen(false);
        },
    });

    const deleteEmployee = useMutation({
        mutationFn: (eid) => axiosClient.delete(`/emp/employees/${eid}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
        },
    });

    if (isLoading) return <p>Loading employees...</p>;

    return (
        <div style={pageStyle}>
            <h1 style={titleStyle}>Employees</h1>

            <input
                type="text"
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={searchStyle}
            />

            <button
                onClick={() => {
                    setSelectedEmployee({
                        first_name: "",
                        last_name: "",
                        email: "",
                        department: "",
                        position: "",
                        profile_picture: null,
                    });
                    setIsEditOpen(true);
                }}
                style={addButtonStyle}
            >
                + Add New Employee
            </button>

            <div style={cardStyle}>
                <table style={tableStyle}>
                    <thead>
                    <tr>
                        <th>Photo</th>
                        <th>First</th>
                        <th>Last</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {employees?.map((emp, index) => (
                        <tr
                            key={emp._id}
                            onClick={() => {
                                setSelectedEmployee(emp);
                                setIsEditOpen(true);
                            }}
                            style={{
                                ...rowStyle,
                                background: index % 2 === 0 ? "#f9fafb" : "white",
                            }}
                        >
                            <td>
                                {emp.profile_picture && (
                                    <img
                                        src={`http://localhost:3000${emp.profile_picture}`}
                                        alt="profile"
                                        style={avatarStyle}
                                    />
                                )}
                            </td>
                            <td>{emp.first_name}</td>
                            <td>{emp.last_name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.department}</td>
                            <td>{emp.position}</td>
                            <td>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteEmployee.mutate(emp._id);
                                    }}
                                    style={deleteButtonStyle}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isEditOpen && selectedEmployee && (
                <EditEmployeeModal
                    employee={selectedEmployee}
                    onClose={() => setIsEditOpen(false)}
                    onSave={(form, file) => {
                        const formData = new FormData();
                        Object.keys(form).forEach((key) => {
                            formData.append(key, form[key]);
                        });
                        if (file) {
                            formData.append("profile_picture", file);
                        }

                        if (selectedEmployee._id) {
                            updateEmployee.mutate({
                                eid: selectedEmployee._id,
                                data: formData,
                            });
                        } else {
                            createEmployee.mutate(formData);
                        }
                    }}
                />
            )}
        </div>
    );
}

export default Employees;

function EditEmployeeModal({ employee, onClose, onSave }) {
    const [form, setForm] = useState({
        first_name: employee?.first_name || "",
        last_name: employee?.last_name || "",
        email: employee?.email || "",
        department: employee?.department || "",
        position: employee?.position || "",
    });

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div style={backdropStyle}>
            <div style={modalStyle}>
                <h2 style={{ marginBottom: "15px" }}>
                    {employee._id ? "Edit Employee" : "Add New Employee"}
                </h2>

                <div style={modalFormStyle}>
                    <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" />
                    <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" />
                    <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
                    <input name="department" value={form.department} onChange={handleChange} placeholder="Department" />
                    <input name="position" value={form.position} onChange={handleChange} placeholder="Position" />

                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                </div>

                <div style={modalButtonRow}>
                    <button onClick={() => onSave(form, file)} style={saveButtonStyle}>Save</button>
                    <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

const pageStyle = {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    background: "#f5f7fa",
    minHeight: "100vh",
};

const titleStyle = {
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "600",
};

const searchStyle = {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "260px",
    marginBottom: "15px",
};

const addButtonStyle = {
    padding: "10px 16px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "15px",
    fontSize: "14px",
};

const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
};

const rowStyle = {
    cursor: "pointer",
    transition: "background 0.2s",
};

const avatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
};

const deleteButtonStyle = {
    padding: "6px 10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
};

const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const modalStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    width: "420px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const modalFormStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
};

const modalButtonRow = {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
};

const saveButtonStyle = {
    padding: "10px 16px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
};

const cancelButtonStyle = {
    padding: "10px 16px",
    background: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
};