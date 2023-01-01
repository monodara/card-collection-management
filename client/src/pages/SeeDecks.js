import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import SingleDeck from "../components/SingleDeck";
import "../cssFiles/decks.css";
import { useNavigate } from "react-router-dom";


const SeeDecks = () => {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();
  //load all decks in the collection;
  const cookies = useCookies("user");
  const userID = cookies[0].UserId;
  useState(async()=>{
    try{
      const response = await axios.get(
        `http://localhost:8000/ShowAllDecks`,
        {params: { userID },}
        );
        setDecks(response.data);
      }catch(error){console.log(error)};
  });

  return (
    <div className="see-decks">

      <h1>See decks</h1>
      <button onClick={()=>{navigate("/decks")}}>Back to Deck Dash</button>
      <button onClick={()=>{navigate("/dashboard")}}>Back to Dashboard</button>
      <div className="deckCollection">
          {decks.map((c, i) => (
            <div key={i}>
              <SingleDeck SingleDeck={c} />
            </div>
          ))}
        </div>
    </div>
  );
};
export default SeeDecks;
