import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/textStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Nav() {
  const [active, setActive] = useState("home"); // "home" | "community" | "profile"
  const navigate = useNavigate();

  const handleNav = (key, path) => {
    setActive(key);
    navigate(path);
  };

  return (
    <div className="col-3 section row justify-content-center align-items-center">
      <div className="row justify-content-center align-items-center">
        <button
          className={`btn_act ${active === "home" ? "active" : ""} mt-3 mb-2`}
          onClick={() => handleNav("home", "/home")}
        >
          Home
        </button>
      </div>
      <div className="row justify-content-center align-items-center">
        <button
          className={`btn_act ${active === "community" ? "active" : ""} mb-2`}
          onClick={() => handleNav("community", "/community")}
        >
          Community
        </button>
      </div>
      <div className="row justify-content-center align-items-center">
        <button
          className={`btn_act ${active === "profile" ? "active" : ""} mb-2`}
          onClick={() => handleNav("profile", "/profile")}
        >
          Profile
        </button>
      </div>
    </div>
  );
}