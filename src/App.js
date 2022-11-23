import { Container } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import Home from "./views/Home";

import './App.css';

function App() {
  return (
    <Container className="App">
        <Routes>
            <Route index element={ <Home /> }/>
            <Route path="/home" element={ <Home /> }/>
        </Routes>
    </Container>
  );
}

export default App;
