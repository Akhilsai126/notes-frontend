import React, { useState } from "react";

function ViewNote({ goHome, apiUrl }) {
    const [code, setCode] = useState("");
    const [note, setNote] = useState("");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleView = async () => {
        if (!code) {
            setMessage("Please enter a code.");
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/view`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            const data = await res.json();

            if (res.status === 200) {
                setNote(data.content);
                setShowModal(true);
                setMessage("");
            } else {
                setMessage(data.message);
                setNote("");
            }
        } catch {
            setMessage("Error connecting to server.");
        }
    };

    return (
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-3xl font-semibold text-green-600 text-center">View Note</h2>

            <input
                type="text"
                placeholder="Enter secret code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="flex justify-between">
                <button
                    onClick={handleView}
                    className="px-5 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
                >
                    View
                </button>
                <button
                    onClick={goHome}
                    className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                    Back
                </button>
            </div>

            {message && <p className="text-red-600 text-center font-medium">{message}</p>}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full relative">
                        <h3 className="text-xl font-semibold mb-4">Your Note</h3>
                        <p className="break-words">{note}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewNote;
