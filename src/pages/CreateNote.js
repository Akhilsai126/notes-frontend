import React, { useState } from "react";

function CreateNote({ goHome, apiUrl }) {
    const [code, setCode] = useState("");
    const [note, setNote] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        if (!code || !note) {
            setMessage("Please enter both code and note.");
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, content: note }),
            });

            const data = await res.json();
            setMessage(data.message);

            if (res.status === 200) {
                setTimeout(() => goHome(), 1500); // Go back to home after 1.5s
            }
        } catch {
            setMessage("Error connecting to server.");
        }
    };

    return (
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-3xl font-semibold text-indigo-600 text-center">Create Note</h2>

            <input
                type="text"
                placeholder="Enter secret code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <textarea
                placeholder="Enter your note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-between">
                <button
                    onClick={handleSubmit}
                    className="px-5 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition"
                >
                    Save Note
                </button>
                <button
                    onClick={goHome}
                    className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                    Back
                </button>
            </div>

            {message && (
                <p className={`text-center font-medium ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default CreateNote;

