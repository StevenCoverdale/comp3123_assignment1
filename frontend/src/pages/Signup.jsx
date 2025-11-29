import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await axiosClient.post("/user/signup", {
                email,
                password,
            });

            // Redirect to login after successful signup
            navigate("/login");

        } catch (err) {
            console.error("Signup error:", err.response?.data);
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div style={container}>
            <form onSubmit={handleSignup} style={form}>
                <h2 style={title}>Create Account</h2>

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

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={input}
                />

                <button type="submit" style={button}>
                    Sign Up
                </button>

                <p style={{ marginTop: "10px" }}>
                    Already have an account?{" "}
                    <span
                        style={{ color: "#2563eb", cursor: "pointer" }}
                        onClick={() => navigate("/login")}
                    >
                        Login
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