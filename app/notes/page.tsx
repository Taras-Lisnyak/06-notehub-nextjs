import {
  QueryClient,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { fetchNotes } from "../../lib/api";
import NotesClient from "./Notes.client";
import css from "./NotesPage.module.css";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, ""],
    queryFn: () => fetchNotes(1, 12, ""),
  });

  // ✅ Явно приводимо до типу DehydratedState | undefined
  const dehydratedState: DehydratedState | undefined = dehydrate(queryClient);

  return (
    <main className={css.container}>
      <ReactQueryStreamedHydration state={dehydratedState}>
        <NotesClient />
      </ReactQueryStreamedHydration>
    </main>
  );
}


