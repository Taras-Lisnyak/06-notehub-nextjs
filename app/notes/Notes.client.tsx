"use client";

import { hydrate, QueryClientProvider, useQuery, DehydratedState } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";
import { useMemo, useState, useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import NoteList from "../../components/NoteList/NoteList";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import Pagination from "../../components/Pagination/Pagination";
import SearchBox from "../../components/SearchBox/SearchBox";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  dehydratedState: DehydratedState;
}

function NotesContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, 12, debouncedSearch),
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Could not fetch the list of notes.</p>;
  if (!data || !data.notes || data.notes.length === 0) {
    return <p>No notes found.</p>;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

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
      <div className={css.controls}>
        <div className={css.controlsLeft}>
          <SearchBox value={searchInput} onSearch={handleSearch} />
        </div>
        <div className={css.controlsCenter}>
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
        <div className={css.controlsRight} />
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
  // hydrate client QueryClient with server state
  useMemo(() => {
    if (dehydratedState) hydrate(queryClient, dehydratedState);
  }, [queryClient, dehydratedState]);

  return (
    <QueryClientProvider client={queryClient}>
      <NotesContent />
    </QueryClientProvider>
  );
}

