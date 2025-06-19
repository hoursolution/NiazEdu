// useAuth.js

import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const useAuth = () => {
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to the login page if the user is not authenticated
      history.push("/login");
    }
  }, [history]);

  return true; // Or user information if needed
};

export default useAuth;
