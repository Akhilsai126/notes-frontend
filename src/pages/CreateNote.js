// src/pages/CreateNote.js
import React, { useState, useRef } from "react";
import { supabase } from "../supabase";
import dayjs from "dayjs";

function CreateNote({ goHome }) {
    const [code, setCode] = useState("");
    const [note, setNote] = useState("");

    const [file, setFile] = useState(null); // image/pdf/video
    const [fileType, setFileType] = useState(""); // type of file
    const [audioBlob, setAudioBlob] = useState(null); // audio recording

    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunks = useRef([]);
    const fileInputRef = useRef();

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // 🎤 START AUDIO RECORDING
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunks.current, { type: "audio/webm" });
                setAudioBlob(blob);
                chunks.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Audio recording error:", err);
            setMessage("Microphone permission denied.");
        }
    };

    // ⏹ STOP AUDIO RECORDING
    const stopRecording = () => {
        if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    // 📤 UPLOAD FILE TO SUPABASE STORAGE
    const uploadFileToStorage = async (fileData, type) => {
        const fileName = `${type}-${dayjs().format("YYYYMMDD-HHmmss")}-${fileData.name || "recorded"}`;

        const { data, error } = await supabase.storage
            .from("notes")
            .upload(fileName, fileData, {
                contentType: fileData.type,
            });

        if (error) {
            console.error("Storage upload error:", error);
            return null;
        }

        const { data: publicUrl } = supabase.storage
            .from("notes")
            .getPublicUrl(fileName);

        return publicUrl.publicUrl;
    };

    // 💾 SAVE EVERYTHING
    const handleSubmit = async () => {
        if (!code) {
            setMessage("Please enter a code");
            return;
        }

        setLoading(true);
        setMessage("Saving...");

        let fileUrl = null;
        let type = null;

        if (file) {
            fileUrl = await uploadFileToStorage(file, fileType);
            type = fileType;
        }

        if (audioBlob) {
            const audioFile = new File([audioBlob], "recordedAudio.webm", {
                type: "audio/webm",
            });

            fileUrl = await uploadFileToStorage(audioFile, "audio");
            type = "audio/webm";
        }

        const { error } = await supabase.from("notes").insert([
            {
                code,
                content: note || null,
                file_url: fileUrl,
                file_type: type,
            },
        ]);

        if (error) {
            console.error("DB insert error:", error);
            setMessage("Error saving note. Check bucket policies.");
            setLoading(false);
            return;
        }

        setMessage("Saved successfully!");
        setTimeout(() => goHome(), 800);

        // Reset
        setCode("");
        setNote("");
        setFile(null);
        setFileType("");
        setAudioBlob(null);
    };

    // OPEN FILE PICKER FOR IMAGE/VIDEO/PDF
    const handleFilePick = (type) => {
        setFileType(type);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const getEmoji = (type) => {
        switch (type) {
            case "image": return "🖼️";
            case "video": return "🎬";
            case "audio/webm": return "🎤";
            case "application/pdf": return "📄";
            default: return "📎";
        }
    };

    return (
        <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow-lg space-y-6 mx-auto mt-10">
            <h2 className="text-3xl font-semibold text-indigo-600 text-center">
                Create Note
            </h2>

            <input
                type="text"
                placeholder="Enter secret code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
            />

            <textarea
                placeholder="Enter your note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg"
            />

            {/* EMOJI BUTTONS */}
            <div className="flex gap-4">
                <button onClick={() => handleFilePick("image")} className="px-4 py-2 text-2xl">🖼️</button>
                <button onClick={() => handleFilePick("video")} className="px-4 py-2 text-2xl">🎬</button>
                <button onClick={() => handleFilePick("application/pdf")} className="px-4 py-2 text-2xl">📄</button>
                <button
                    onClick={!isRecording ? startRecording : stopRecording}
                    className={`px-4 py-2 text-2xl ${isRecording ? "text-red-500" : "text-green-500"}`}
                >
                    {isRecording ? "⏹" : "🎤"}
                </button>
            </div>

            {/* HIDDEN FILE INPUT */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept={fileType === "image" ? "image/*" :
                    fileType === "video" ? "video/*" :
                        fileType === "application/pdf" ? "application/pdf" : "*"}
                onChange={(e) => setFile(e.target.files[0])}
            />

            {/* SHOW FILE NAME */}
            {file && (
                <div className="flex items-center gap-2 mt-2 text-gray-700 font-medium">
                    <span>{getEmoji(file.type)}</span>
                    <span>{file.name}</span>
                </div>
            )}

            {audioBlob && <p className="text-green-600 font-medium">🎤 Audio ready ✓</p>}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg"
            >
                {loading ? "Saving..." : "Save Note"}
            </button>

            <button
                onClick={goHome}
                className="w-full py-3 bg-gray-300 text-gray-700 rounded-lg"
            >
                Back
            </button>

            {message && <p className="text-center text-indigo-600 font-medium">{message}</p>}
        </div>
    );
}

export default CreateNote;
