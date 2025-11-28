import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import axiosClient from "../api/axiosClient";
import { useState } from "react";

const columnHelper = createColumnHelper();

function Employees() {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        position: "",
        salary: "",
    });

    const { data: employees = [], isLoading, error } = useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            const res = await axiosClient.get("/emp/employees");
            return res.data;
        },
    });

    const createEmployee = useMutation({
        mutationFn: async (payload) => {
            return axiosClient.post("/emp/employees", payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
        },
    });

    const deleteEmployee = useMutation({
        mutationFn: async (eid) => {
            return axiosClient.delete(`/emp/employees/${eid}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
        },
    });

    const columns = [
        columnHelper.accessor(row => `${row.first_name} ${row.last_name}`, {
            id: "name",
            header: "Name",
        }),
        columnHelper.accessor("email", {
            header: "Email",
        }),
        columnHelper.accessor("position", {
            header: "Position",
        }),
        columnHelper.accessor("salary", {
            header: "Salary",
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <button onClick={() => deleteEmployee.mutate(row.original._id)}>
                    Delete
                </button>
            ),
        }),
    ];

    const table = useReactTable({
        data: employees,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createEmployee.mutate({
            ...form,
            salary: Number(form.salary),
        });
        setForm({
            first_name: "",
            last_name: "",
            email: "",
            position: "",
            salary: "",
        });
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2>Employees</h2>
            {isLoading && <p>Loading employees...</p>}
            {error && <p style={{ color: "red" }}>Failed to load employees</p>}

            <h3>Add Employee</h3>
            <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                        style={{ flex: 1 }}
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                        style={{ flex: 1 }}
                    />
                </div>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ flex: 1 }}
                    />
                    <input
                        type="text"
                        name="position"
                        placeholder="Position"
                        value={form.position}
                        onChange={handleChange}
                        required
                        style={{ flex: 1 }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="number"
                        name="salary"
                        placeholder="Salary"
                        value={form.salary}
                        onChange={handleChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>
                <button type="submit">Create Employee</button>
            </form>

            <h3>Employee List</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                                style={{ borderBottom: "1px solid #ccc", padding: "8px", textAlign: "left" }}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td
                                key={cell.id}
                                style={{ padding: "8px", borderBottom: "1px solid #eee" }}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Employees;