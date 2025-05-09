'use client';

import MoodSelector from "@/app/MoodSelector";
import { useState } from 'react';



export default function Home() {
    const [mixtapeTitle, setMixtapeTitle] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userMood, setUserMood] = useState("");
    const [userGenre, setUserGenre] = useState("");
    const [userDescription, setUserDescription] = useState("");
    const [wordCount, setWordCount] = useState(3);

    async function generateMixtapeTitle() {

        // Validate
        if (!userMood || !userGenre || !userDescription) {
            alert("Please Select a mood, genre, and description.");
            return;
        }
        setLoading(true);
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mood: userMood,
                genre: userGenre,
                description: userDescription, // Prompt like.
                wordCount: wordCount
            }),
        });

        const data = await res.json();
        setMixtapeTitle(data.title);
        setLoading(false);
        console.log('Mixtape Title:', data.title);

    }

    const handleCopy = () => {
        if (!mixtapeTitle) return;
        navigator.clipboard.writeText(mixtapeTitle).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };



    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-900 via-pink-600 to-yellow-400 text-white text-center">
            <h1 className="text-6xl font-extrabold mb-6">🎶 Playlist Name Generator 🎶</h1>
            {/*Lift state up from mood*/}
            <MoodSelector
                onMoodChange={setUserMood}
                onDescriptionChange={setUserDescription}
                onGenreChange={setUserGenre}
                onWordCountChange={setWordCount} // Pass the word count to the parent
            />

            <button
                onClick={generateMixtapeTitle}
                disabled={loading} // Disable the button when loading
                className={`bg-orange-200 text-purple-800 text-2xl px-9 py-6 shadow-2xl transition mb-6 mt-6 cursor-po ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-100"
                }`}
            >
                {loading ? "Generating..." : "🔀 Generate Mixtape Title"}
            </button>

            {mixtapeTitle && (
                <div className="bg-gray-900 bg-opacity-40 p-6 rounded-xl shadow-xl backdrop-blur w-full max-w-xl mb-6">
                    <h2 className="text-3xl font-bold mb-4">{mixtapeTitle}</h2>

                    <button
                        onClick={handleCopy}
                        className="bg-white text-purple-800 px-4 py-2 rounded shadow hover:bg-pink-200 transition"
                    >
                        📋 {copied ? "Copied!" : "Copy to Clipboard"}
                    </button>
                </div>
            )}
        </main>
    );
}