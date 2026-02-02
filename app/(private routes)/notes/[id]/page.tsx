import type { Metadata } from "next";
import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "@/lib/api/serverApi"; 
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Note } from "@/types/note";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const note: Note = await fetchNoteById(id);

  const title = note?.title
    ? `NoteHub - ${note.title}`
    : "NoteHub - Note Details";

  const description = note?.content
    ? note.content.slice(0, 160) + "..."
    : "Detailed view of your note.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://yourdomain.com/notes/${id}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={id} />
    </HydrationBoundary>
  );
}