export type Note = {
  id: number       // JSONPlaceholder restituisce id numerico
  title: string
  body: string    
}

export const getNotes = async (): Promise<Note[]> => {
  const res = await fetch('http://localhost:4000/notes')
  if (!res.ok) throw new Error('Failed to fetch notes')
  return res.json()  
}

export const getNote = async (id: number): Promise<Note> => {
  const res = await fetch(`http://localhost:4000/notes/${id}`)
  if (!res.ok) throw new Error('Failed to fetch note')
  return res.json()
}

export const createNote = async (noteData: Omit<Note, 'id'>): Promise<Note> => {
  const res = await fetch('http://localhost:4000/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(noteData),
  })
  if (!res.ok) throw new Error('Failed to create note')
  return res.json()  
}

export const updateNote = async (note: Note): Promise<Note> => {
  const res = await fetch(`http://localhost:4000/notes/${note.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(note),
  })
  if (!res.ok) throw new Error('Failed to update note')
  return res.json()  
}
