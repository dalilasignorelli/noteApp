import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button" 
import { useState } from 'react'
//import notesData from '../../esempio.json';
import { ChevronLeftIcon } from "lucide-react";
import { queryOptions, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getNote, updateNote, type Note } from '../../api'
import {queryClient} from "../../App"

/*export type Note = {
  id: string;
  title: string;
  body: string;
};

async function getNote(id: string) {
  const note = notesData.find((n) => n.id === id);
  if (!note) {
    throw new Error("Note not found");
  }
  return note;
}

//aggiorna solo lo stato in memoria (cache di React Query) -- i dati non vengono aggiornati nel file json per fare questo serve un be che gestisca la scrittura
async function updateNote(updatedNote: Note): Promise<Note> {
  const idx = notesData.findIndex((n) => n.id === updatedNote.id);
  if (idx !== -1) {
    notesData[idx] = updatedNote;
  }
  // in un vero backend qui faresti una fetch PUT/POST
  return updatedNote;
}*/

const notebyidQueryOptions = (id: number) => queryOptions({
  queryKey: ["notes", id],
  queryFn : () => getNote(id)})

export const Route = createFileRoute('/notes/$id')({
  component: RouteComponent,
  loader: async ({ params }) => queryClient.ensureQueryData(notebyidQueryOptions(Number(params.id))),
  pendingComponent: () => <p>Caricamento in corso</p>
})

function RouteComponent() {

  const {id} = useParams({from: "/notes/$id"})

  const { data:initialNote } = useSuspenseQuery(notebyidQueryOptions(id));
  const [note, setNote] = useState(initialNote);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedNote: Note) => updateNote(updatedNote),
    onSuccess: () => {
      alert("Nota salvata!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", note.id] });
    },
    //onSuccess: (updatedNote) => {
      // aggiorna cache globale
      //queryClient.setQueryData(['note', updatedNote.id], updatedNote)
      //queryClient.setQueryData<Note[]>(['notes'], (old = []) =>
        //old.map(n => (n.id === updatedNote.id ? updatedNote : n))
      //)
      //alert("Nota salvata!")
    //},
    onError: (error) => {
      alert("Errore nel salvataggio: " + (error as Error).message);
    },
  });

  return (
    <div className="p-2 flex flex-col gap-2 h-auto">
      <div className="flex items-center gap-2">
      <Link to="..">
        <Button type="button" variant="secondary" size="icon">
          <ChevronLeftIcon />
        </Button>
      </Link>

      <Input
        value={note.title}
        placeholder="Title"
        onChange={(e) => setNote((n) => ({ ...n, title: e.target.value }))}
      />
      </div>

      <div className="flex-1">
        <textarea
          value={note.body}
          onChange={(e) => setNote((n) => ({ ...n, body: e.target.value }))}
          className="w-full p-2 border rounded resize-none h-50"
        />
      </div>

      <Button type="button" onClick={() => mutation.mutate(note)}>
        Salva
      </Button>
    </div>
  );
}
