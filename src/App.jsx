
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Splash from "./Splash";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}
