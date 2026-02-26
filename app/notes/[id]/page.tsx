import {
  QueryClient,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { fetchNoteById } from "../../../lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import css from "./NoteDetails.module.css";

export default async function NoteDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  // ✅ Явно приводимо до типу DehydratedState | undefined
  const dehydratedState: DehydratedState | undefined = dehydrate(queryClient);

  return (
    <main className={css.container}>
      <ReactQueryStreamedHydration state={dehydratedState}>
        <NoteDetailsClient />
      </ReactQueryStreamedHydration>
    </main>
  );
}

