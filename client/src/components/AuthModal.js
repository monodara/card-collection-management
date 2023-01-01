import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "../cssFiles/authmodal.css";

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [email, setEmail] = useState(null);

  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //console.log(email, password, confirmPassword);

  const handleClick = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    // console.log("submit profile button clicked ");
    e.preventDefault();
    try {
      if (isSignUp && password !== confirmPassword) {
        setError("Passwords need to match");
        return;
      }
      const response = await axios.post(
        `http://localhost:8000/${isSignUp ? "signup" : "login"}`,
        { email, password }
      );
      setCookie("AuthToken", response.data.token);
      setCookie("UserId", response.data.userId, {path: "/"});//store the user ID that can be loaded on every page;
      

      const success = (response.status = 201);
      if (success && isSignUp) navigate("/dashboard");

      if (success && !isSignUp) navigate("/dashboard");

      // window.location.reload();
      // console.log("make a post request to our database");
    } catch (error) {
      const errMess = await error.message;
      if(errMess.includes("400")) setError("Password does not match the account.");
      if(errMess.includes("401")) setError("Account does not existed. Please create a new account.");
      if(errMess.includes("409")) setError("User already exist. Please try to log in");
    }
  };

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClick}>
        x
      </div>

      <h2> {isSignUp ? "CREATE ACCOUNT" : "LOG IN"}</h2>
      {/* <p> by clicking etc</p> */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          placeholder="email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type="password-check"
            id="Confirm-password"
            placeholder="Confirm-password"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <input className="secondary-button" type="submit" />
        <p>{error}</p>
      </form>
    </div>
  );
};
export default AuthModal;
