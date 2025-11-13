import React, { useState } from "react";
import CreateNote from "./pages/CreateNote";
import ViewNote from "./pages/ViewNote";

const API_BASE_URL = process.env.REACT_APP_API_URL; // use environment variable

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans">
      {page === "home" && (
        <div className="text-center">
          <h1 className="text-5xl font-bold text-indigo-600 mb-10">📝 Notes App</h1>
          <div className="space-x-6">
            <button
              onClick={() => setPage("create")}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition"
            >
              Create Note
            </button>
            <button
              onClick={() => setPage("view")}
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
            >
              View Note
            </button>
          </div>
        </div>
      )}

      {page === "create" && <CreateNote goHome={() => setPage("home")} apiUrl={API_BASE_URL} />}
      {page === "view" && <ViewNote goHome={() => setPage("home")} apiUrl={API_BASE_URL} />}
    </div>
  );
}

export default App;
