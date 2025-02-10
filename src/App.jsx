import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./pages/admin"
import Adminpage from "./pages/adminpage"

import HomePage from "./pages/homepage"


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminpage" element={<Adminpage />} />
      </Routes>
    </Router>
  );
};

export default App;
