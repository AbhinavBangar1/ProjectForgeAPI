import { useState } from "react";
import API, { setAuthToken } from "../Api.js";
import "../styles/Auth.css";

function Register({ setToken, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await API.post("/auth/register", {
        username,
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      setToken(res.data.token);

    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Register</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={switchToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
