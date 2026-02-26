"use client";

import { HydrationBoundary, QueryClientProvider, useQuery, DehydratedState } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";
import { useMemo, useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import NoteList from "../../components/NoteList/NoteList";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  dehydratedState: DehydratedState;
}

function NotesContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", 1, ""],
    queryFn: () => fetchNotes(1, 12, ""),
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Could not fetch the list of notes.</p>;
  if (!data || !data.notes || data.notes.length === 0) {
    return <p>No notes found.</p>;
  }

  return (
    <>
      <div className={css.toolbar}>
        <h1>Notes</h1>
        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          + Create Note
        </button>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
      <NoteList notes={data.notes} />
    </>
  );
}

export default function NotesClient({ dehydratedState }: NotesClientProps) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <NotesContent />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

