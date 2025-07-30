// Logout.js

import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  const handleLogout = async () => {
    navigate = useNavigate();
    try {
      await axios.post(`${BASE_URL}/logout/`, null, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      // Remove token and user from storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect or perform other actions after successful logout
      history.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
