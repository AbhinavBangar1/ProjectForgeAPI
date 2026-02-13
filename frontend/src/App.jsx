import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token"));

  if (token) {
    return <Dashboard setToken={setToken} />;
  }

  return (
    <>
      {page === "login" ? (
        <Login
          setToken={setToken}
          switchToRegister={() => setPage("register")}
        />
      ) : (
        <Register
          setToken={setToken}
          switchToLogin={() => setPage("login")}
        />
      )}
    </>
  );
}

export default App;
