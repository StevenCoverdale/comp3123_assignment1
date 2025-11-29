import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axiosClient.post("/user/login", {
                email,
                password,
            });

            // Save token
            localStorage.setItem("token", res.data.token);

            // Redirect to employees page
            window.location.href = "/employees";


        } catch (err) {
            console.error("Login error:", err.response?.data);
            setError("Invalid email or password");
        }
    };

    return (
        <div style={container}>
            <form onSubmit={handleLogin} style={form}>
                <h2 style={title}>Login</h2>

                {error && <p style={errorStyle}>{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={input}
                />

                <button type="submit" style={button}>
                    Login
                </button>

                <p style={{ marginTop: "10px" }}>
                    Don’t have an account?{" "}
                    <span
                        style={{ color: "#2563eb", cursor: "pointer" }}
                        onClick={() => navigate("/signup")}
                    >
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
}

/* ------------------ Styles ------------------ */

const container = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f3f4f6",
};

const form = {
    background: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "350px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const title = {
    fontSize: "28px",
    marginBottom: "20px",
    textAlign: "center",
};

const input = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
};

const button = {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
};

const errorStyle = {
    color: "#dc2626",
    marginBottom: "10px",
    textAlign: "center",
};