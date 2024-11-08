
"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { clientTrpc, type RouterOutputs } from "~/trpc/react";
import { NoteEditor } from "./NoteEditor";
import { NoteCard } from "./NoteCard";

type Topic = RouterOutputs["topic"]["getAll"][0];

const Content: React.FC = () => {
    const { data: sessionData } = useSession();

    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    const { data: topics, refetch: refetchTopics } = clientTrpc.topic.getAll.useQuery(
        undefined, // no input
        {
            enabled: sessionData?.user !== undefined,
            // onSuccess: (data) => {
            //   setSelectedTopic(selectedTopic ?? data[0] ?? null);     i sorted this using use effect instead 
            // },
        }
    );

    useEffect(() => {
        if (topics?.length) {
            setSelectedTopic(selectedTopic ?? topics[0] ?? null);
        }
    }, [topics, selectedTopic]);

    const createTopic = clientTrpc.topic.create.useMutation({
        onSuccess: () => {
            void refetchTopics();
        },
    });

    const { data: notes, refetch: refetchNotes } = clientTrpc.note.getAll.useQuery(
        {
            topicId: selectedTopic?.id ?? "",
        },
        {
            enabled: sessionData?.user !== undefined && selectedTopic !== null,
        }
    );

    const createNote = clientTrpc.note.create.useMutation({
        onSuccess: () => {
            void refetchNotes();
        },
    });

    const deleteNote = clientTrpc.note.delete.useMutation({
        onSuccess: () => {
            void refetchNotes();
        },
    });

    return (
        <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
            <div className="px-2">
                <ul className="menu rounded-box w-56 bg-base-100 p-2">
                    {topics?.map((topic) => (
                        <li key={topic.id}>
                            <a
                                href="#"
                                onClick={(evt) => {
                                    evt.preventDefault();
                                    setSelectedTopic(topic);
                                }}
                            >
                                {topic.title}
                            </a>
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    placeholder="New Topic"
                    className="input-bordered input input-sm w-full"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            createTopic.mutate({
                                title: e.currentTarget.value,
                            });
                            e.currentTarget.value = "";
                        }
                    }}
                />
            </div>
            <div className="col-span-3">
                <div>
                    {notes?.map((note) => (
                        <div key={note.id} className="mt-5">
                            <NoteCard
                                note={note}
                                onDelete={() => void deleteNote.mutate({ id: note.id })}
                            />
                        </div>
                    ))}
                </div>

                <NoteEditor
                    onSave={async ({ title, content }) => {
                        await createNote.mutateAsync({
                            title,
                            content,
                            topicId: selectedTopic?.id ?? "",
                        });
                    }}
                />
            </div>
        </div>
    )
}

export default Content