import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ✅ You forgot this import — this was causing the React error
import EditEmployeeModal from "../components/EditEmployeeModal";

/* Debounce Hook */
function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debounced;
}

function Employees() {
    const queryClient = useQueryClient();

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, 300);

    const { data: employees, isLoading } = useQuery({
        queryKey: ["employees", debouncedSearch],
        queryFn: () => {
            if (!debouncedSearch.trim()) {
                return axiosClient.get("/emp/employees").then((res) => res.data);
            }
            return axiosClient
                .get("/emp/employees/search", { params: { query: debouncedSearch } })
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
        onError: (error) => {
            console.error("Create employee error:", error.response?.data);
            alert("Failed to create employee. Check all required fields.");
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
        onError: (error) => {
            console.error("Update employee error:", error.response?.data);
            alert("Failed to update employee. Check all required fields.");
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

            {/* Top bar: Add + Logout */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
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

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    style={{
                        padding: "10px 16px",
                        background: "#e11d48",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </div>

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

/* ------------------ Styles ------------------ */

const pageStyle = {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
};

const titleStyle = {
    fontSize: "32px",
    marginBottom: "20px",
};

const searchStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc",
};

const addButtonStyle = {
    padding: "10px 16px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
};

const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
};

const rowStyle = {
    cursor: "pointer",
};

const avatarStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
};

const deleteButtonStyle = {
    padding: "6px 12px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
};