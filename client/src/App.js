import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Deckdash from "./pages/DeckDash";
import Collection from "./pages/Collection";
import "./cssFiles/login.css";
import SeeDecks from "./pages/SeeDecks";
import NewDeck from "./pages/NewDeck";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/decks" element={<Deckdash />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/seedecks" element={<SeeDecks />} />
        <Route path="/new-deck" element={<NewDeck />} />

        {/* {authToken && <Route path="/dashboard" element={<Dashboard />} />}
        {authToken && <Route path="/onboarding" element={} />}
        {authToken && <Route path="/dashboard" element={<Dashboard />} />}   */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
