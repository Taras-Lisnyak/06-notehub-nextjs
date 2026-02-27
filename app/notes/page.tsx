import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";
import NotesClient from "./Notes.client";
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
      {/* ✅ Передаємо dehydratedState у клієнтський компонент через HydrationBoundary */}
      <HydrationBoundary state={dehydratedState}>
        <NotesClient dehydratedState={dehydratedState} />
      </HydrationBoundary>
    </main>
  );
}


