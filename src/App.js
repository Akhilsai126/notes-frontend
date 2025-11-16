// src/App.js
import React, { useState } from "react";
import Home from "./pages/Home";
import CreateNote from "./pages/CreateNote";
import ViewNote from "./pages/ViewNote";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="min-h-screen bg-gray-100">
      {page === "home" && <Home goCreate={() => setPage("create")} goView={() => setPage("view")} />}
      {page === "create" && <CreateNote goHome={() => setPage("home")} />}
      {page === "view" && <ViewNote goHome={() => setPage("home")} />}
    </div>
  );
}



