import { useNavigate } from "react-router-dom";
import { useCookies} from "react-cookie";
import "../cssFiles/dashboard.css";


const Deckdash = ({ Email }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const navigate = useNavigate();
  const newDeck = () => {
    setCookie("deckName","", {path: "/"});
    navigate("/new-deck");
  };
  const seeDecks = (Email) => {
    //console.log(Email);

    navigate("/seeDecks");
  };
  const goHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="deckdash">
      <div>
        <h1>Deck Dash</h1>
        <button onClick={goHome}>home</button>
        <button onClick={seeDecks}>See Decks</button>
        <button onClick={newDeck}>NewDeck</button>
        <br />
      </div>
    </div>
  );
};
export default Deckdash;
