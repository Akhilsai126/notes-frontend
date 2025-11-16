import React from "react";

export default function Home({ goCreate, goView }) {
    return (
        <div className="max-w-md mx-auto p-6 flex flex-col items-center justify-center h-screen space-y-6">
            <h1 className="text-4xl font-bold text-indigo-600">🗒️ NotePad</h1>
            <p className="text-gray-500 text-center">
                Create and view notes with text, images, audio, video, and PDFs.
            </p>

            <div className="flex flex-col space-y-4 w-full">
                <button
                    onClick={goCreate}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                >
                    Create Note
                </button>
                <button
                    onClick={goView}
                    className="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
                >
                    View Note
                </button>
            </div>
        </div>
    );
}


