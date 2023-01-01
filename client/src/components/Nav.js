import "../cssFiles/nav.css";
const Nav = ({ minimal, setShowModal, showModal, setIsSignUp }) => {
  //passing through
  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false);
  };
  const authToken = false;
  return (
    <nav>
      <div className="logo-container"></div>
      {!authToken && !minimal && (
        <button
          className="nav-button"
          onClick={handleClick}
          disabled={showModal}
        >
          Log in
        </button>
      )}
    </nav>
  );
};

export default Nav;
