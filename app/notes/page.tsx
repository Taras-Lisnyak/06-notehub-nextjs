import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";
import NotesContent from "./Notes.client";
import css from "./NotesPage.module.css";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, ""],
    queryFn: () => fetchNotes(1, 12, ""),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <main className={css.container}>
      <HydrationBoundary state={dehydratedState}>
        <NotesContent />
      </HydrationBoundary>
    </main>
  );
}


