import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { accessToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h3 className="logo">QUery_Genius</h3>
      <ul className="nav-links">
        <li>
          <Link to={"/chat"}>Chat</Link>
        </li>
        <li>
          <Link to={"/history"}>History</Link>
        </li>
        {accessToken ? (
          <>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <Link to={"/login"}>Login</Link>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
