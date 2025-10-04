import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 4000;
const filePath = "./src/esempio.json";

app.use(cors());
app.use(express.json());

type Note = {
  id: number;
  title: string;
  body: string;
};


function readNotes() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeNotes(notes: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), "utf-8");
}

// GET tutte le note
app.get("/notes", (req: express.Request, res: express.Response) => {
  res.json(readNotes());
});

// GET una nota per id
app.get("/notes/:id", (req: express.Request, res: express.Response) => {
  const noteId = Number(req.params.id);
  const note = readNotes().find((n: any) => n.id === noteId);
  if (!note) return res.status(404).json({ error: "Note not found" });
  res.json(note);
});

// POST crea nuova nota
app.post("/notes", (req: express.Request, res: express.Response) => {
  const notes = readNotes();
  const maxId = notes.length > 0 ? Math.max(...notes.map((n: any) => Number(n.id))) : 0;
  const newNote = { 
    id: maxId + 1,
    title: req.body.title || "",
    body: req.body.body || ""
  };
  notes.push(newNote);
  writeNotes(notes);
  res.status(201).json(newNote);
});

// PUT aggiorna nota
app.put("/notes/:id", (req: express.Request, res: express.Response) => {
  const notes = readNotes();
  const noteId = Number(req.params.id);
  const index = notes.findIndex((n: any) => n.id === noteId);
  if (index === -1) return res.status(404).json({ error: "Note not found" });

  notes[index] = { ...notes[index], ...req.body };
  writeNotes(notes);
  res.json(notes[index]);
});

// Avvio server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});