"use client";

import { hydrate, QueryClientProvider, useQuery, DehydratedState } from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import { useMemo } from "react";
import { QueryClient } from "@tanstack/react-query";
import css from "./NoteDetails.module.css";
import Link from "next/link";

interface NoteDetailsClientProps {
  id: string;
  dehydratedState: DehydratedState;
}

function NoteDetailsContent({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p>Loading note...</p>;
  if (isError) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching note:", error);
    return <p>Could not fetch the note. Error: {errorMessage}</p>;
  }
  if (!data) return <p>Note not found.</p>;

  return (
    <article className={css.article}>
      <Link href="/notes" className={css.backLink}>
        ← Back to Notes
      </Link>
      <h1 className={css.title}>{data.title}</h1>
      <p className={css.content}>{data.content}</p>
      <span className={css.tag}>{data.tag}</span>
    </article>
  );
}

export default function NoteDetailsClient({
  id,
  dehydratedState,
}: NoteDetailsClientProps) {
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

  useMemo(() => {
    if (dehydratedState) hydrate(queryClient, dehydratedState);
  }, [queryClient, dehydratedState]);

  return (
    <QueryClientProvider client={queryClient}>
      <NoteDetailsContent id={id} />
    </QueryClientProvider>
  );
}

