import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./pages/admin";
import Adminpage from "./pages/adminpage"
import TIME from "./pages/time"



const App = () => {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<Admin />} />
       <Route path="/adminpage" element={<Adminpage />} />
       <Route path="/time" element={<TIME />} />

      </Routes>
    </Router>
  );
};

export default App;
