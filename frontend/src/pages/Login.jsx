import { useState } from "react";
import API, { setAuthToken } from "../Api.js";
import "../styles/Auth.css";

function Login({ setToken, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      setToken(res.data.token);
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p className="auth-switch">
          New here?{" "}
          <span onClick={switchToRegister}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
