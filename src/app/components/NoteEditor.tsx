import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export const NoteEditor = ({
    onSave,
}: {
    onSave: (note: { title: string; content: string }) => Promise<void>; // Ensure onSave is async
}) => {
    const [code, setCode] = useState<string>("");
    const [title, setTitle] = useState<string>("");

    const handleSave = async () => {
        // Make the save operation async
        if (title.trim().length > 0 && code.trim().length > 0) {
            try {
                // Call the onSave prop asynchronously
                await onSave({ title, content: code });
                setCode("");  // Clear content after saving
                setTitle(""); // Clear title after saving
            } catch (error) {
                console.error("Error saving note:", error);
            }
        }
    };

    return (
        <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">
                    <input
                        type="text"
                        placeholder="Note title"
                        className="input-primary input input-lg w-full font-bold"
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                    />
                </h2>
                <CodeMirror
                    value={code}
                    width="500px"
                    height="30vh"
                    minWidth="100%"
                    minHeight="30vh"
                    extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
                    onChange={(value) => setCode(value)}
                    className="border border-gray-300"
                />
            </div>
            <div className="card-actions justify-end">
                <button
                    onClick={handleSave} // Use async save handler
                    className="btn-primary btn"
                    disabled={title.trim().length === 0 || code.trim().length === 0}
                >
                    Save
                </button>
            </div>
        </div>
    );
};
