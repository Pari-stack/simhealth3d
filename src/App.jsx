import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./Home"; // you’ll create this
import LoginPage from "./Splash"; // optional, if you have it

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
