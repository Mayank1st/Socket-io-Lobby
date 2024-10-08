import React from "react";
import { Routes, Route } from "react-router-dom";
import Lobby from "../components/Lobby";
import Creator from "../components/Creator";
import Participent from "../components/Participent";
import Home from "../components/Home";

function AllRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/creator" element={<Creator />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/participent" element={<Participent />} />
      </Routes>
    </div>
  );
}

export default AllRoutes;
