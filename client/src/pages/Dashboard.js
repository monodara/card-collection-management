import "../cssFiles/dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";


const Dashboard = () => {

  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const goToDecks = () => {
    // console.log("EMAIL", );
    navigate("/decks");
  };
  const goToCollection = async () => {
    //load all the cards in the user's collection
    // try{
    //   const response = await axios.get(
    //     `http://localhost:8000/loadCollection`,
    //     {  }
    //   );
    //   console.log(response); 

    // }catch(error){console.log(error)};
    navigate("/collection");
  };
  const logout = () =>{
    removeCookie('user',{path:'/'});
    removeCookie('token',{path:'/'});
    console.log(cookies)
    navigate("/");
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <button onClick={goToDecks}>Decks</button>
      <button onClick={goToCollection}>Collection</button>
      <button onClick={logout}>Log out</button>
    </div>
  );
};
export default Dashboard;
