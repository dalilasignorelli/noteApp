import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from "../../components/ui/button";
import {  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {useState } from 'react'
//import notesData from '../../esempio.json';
import {getNotes, createNote, type Note} from '../../api';


/*async function getNotes() {
  return notesData;
}*/

export const Route = createFileRoute('/notes/')({
  component: RouteComponent,
  loader: async () => await getNotes(),
})

//si può solo simulare la creazione in memoria (non salvarla sul file).
/*async function createNote() {
  const id = Date.now().toString(); //serve solo se stai creando una nota in memoria senza backend, quindi non c’è nessun server che generi l’id automaticamente

  const newNote = {
    id,
    title: "",
    body: "",
  };

  // qui normalmente faresti una chiamata POST a un server
  return newNote;
}*/

function RouteComponent() {
  
  const [newTitle, setNewTitle] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  //const navigate = useNavigate();
  const queryClient = useQueryClient();
 
  const { data: notes } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  });

  const mutation = useMutation({
    mutationFn: (title:string) => createNote ({ title, body: ""}), //mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.setQueryData<Note[]>(['notes'], (old = []) => [...old, newNote])
      setNewTitle("")
      setIsDialogOpen(false)

      // aggiorna la cache delle note
      //queryClient.setQueryData(['notes'], (old: any[] = []) => [...old, newNote]);
      // naviga alla nota appena creata
      //navigate({ to: '/notes/$id', params: { id: newNote.id } });
    },
  });

  const handleSave = () => {
    mutation.mutate(newTitle)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow focus:outline-none">
      <div className="flex justify-between items-center mb-6 focus:outline-none">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white focus:outline-none">Notes</h1>
      
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Note</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nuova Nota</DialogTitle>
              <DialogDescription>
                Inserisci il titolo della nuova nota e clicca Salva.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 mt-2">
              <Input
                placeholder="Titolo della nota"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <DialogFooter className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Annulla</Button>
              </DialogClose>
              <Button onClick={handleSave}>Salva</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ul className="space-y-4">
        {notes?.map((note: any) => (
          <Link className="hover:text-blue-500"
            to={"/notes/$id"}
            key={note.id}
            params={{ id: note.id }}>
          <li key={note.id} className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{note.title}</h2>
            {/*<p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{note.body}</p>*/}
          </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

