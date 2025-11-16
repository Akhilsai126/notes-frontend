// src/pages/ViewNote.js
import React, { useState } from "react";
import { supabase } from "../supabase";

function ViewNote({ goHome }) {
    const [code, setCode] = useState("");
    const [rows, setRows] = useState([]);
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleView = async () => {
        if (!code) {
            setMessage("Please enter a code.");
            return;
        }

        setMessage("Loading...");
        try {
            const { data, error } = await supabase
                .from("notes")
                .select("*")
                .eq("code", code)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("select error:", error);
                setMessage("Error fetching note.");
                return;
            }

            if (!data || data.length === 0) {
                setMessage("No note found for this code.");
                setRows([]);
                return;
            }

            setRows(data);
            setShowModal(true);
            setMessage("");
        } catch (err) {
            console.error("view error:", err);
            setMessage("Error connecting to Supabase.");
        }
    };

    const fileIcon = (type) => {
        switch (type) {
            case "image":
                return "🖼️";
            case "audio":
            case "audio/webm":
                return "🎤";
            case "video":
                return "🎬";
            case "application/pdf":
                return "📄";
            default:
                return "📎";
        }
    };

    return (
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6 mx-auto mt-10">
            <h2 className="text-3xl font-semibold text-green-600 text-center">View Note</h2>

            <input
                type="text"
                placeholder="Enter secret code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="flex justify-between mt-3">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-auto">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full my-12 relative">
                        <h3 className="text-xl font-semibold mb-4 text-center">Your Note</h3>

                        {/* Text content */}
                        {rows.map((r, idx) => (
                            <div key={idx} className="mb-4 border-b pb-3">
                                {r.content && <div className="mb-2 break-words whitespace-pre-wrap">{r.content}</div>}

                                {r.file_url && (
                                    <div className="border rounded p-3 flex flex-col space-y-2">
                                        <div className="flex items-center space-x-2 font-medium text-gray-700">
                                            <span>{fileIcon(r.file_type)}</span>
                                            <span>{r.file_type?.toUpperCase() ?? "File"}</span>
                                            <span className="text-sm text-gray-500">{r.file_url.split("/").pop()}</span>
                                        </div>

                                        {r.file_type === "image" && (
                                            <img src={r.file_url} alt="img" className="w-full max-h-72 object-contain rounded" />
                                        )}

                                        {(r.file_type === "audio" || r.file_type === "audio/webm") && (
                                            <audio controls src={r.file_url} className="w-full" />
                                        )}

                                        {r.file_type === "video" && (
                                            <video controls src={r.file_url} className="w-full max-h-96 rounded" />
                                        )}

                                        {r.file_type === "application/pdf" && (
                                            <iframe
                                                title={`pdf-${idx}`}
                                                src={r.file_url}
                                                className="w-full h-96 border rounded"
                                            />
                                        )}

                                        {(!["image", "audio", "audio/webm", "video", "application/pdf"].includes(r.file_type)) && (
                                            <div>
                                                <span className="text-indigo-600 underline cursor-pointer">
                                                    📎 File cannot preview
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold"
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
