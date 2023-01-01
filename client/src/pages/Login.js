import AuthModal from "../components/AuthModal";
import { useState } from "react";
import "../cssFiles/login.css";
import Nav from "../components/Nav";
import { useCookies } from "react-cookie";


const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    console.log("submit new profile clicked");
    setShowModal(true);
    setIsSignUp(true);

  };

  const authToken = false;

  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="overlay">
      <Nav
        minimal={false}
        authToke={authToken}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp}
      />
      <div className="home">
        <h1 className="primary-title"> </h1>

        <button className="primary-button" onClick={handleClick}>
          {authToken ? "signout" : "Create Account"}
        </button>

        {showModal && (
          <AuthModal
            setShowModal={setShowModal}
            setIsSignUp={setIsSignUp}
            isSignUp={isSignUp}
          />
        )}
      </div>
    </div>
  );
};
export default Home;
