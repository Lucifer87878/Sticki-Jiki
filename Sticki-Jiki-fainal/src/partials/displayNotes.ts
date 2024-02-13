import { Note } from "./types/interfaces";
import { updateNoteContent, deleteNoteById } from "./updateDelete";

// Function to display notes on the page
export function displayUserNotes(notesList: Note[]) {
    const notesSection = document.querySelector(".notes-article") as HTMLElement;
  
    // Clear existing notes
    notesSection.innerHTML = "";
  
    notesList.forEach((note) => {
      const newNoteElement = document.createElement("article");
  
      newNoteElement.setAttribute("note-id", note.id);
      newNoteElement.setAttribute("note-title", note.title);
      newNoteElement.setAttribute("note-note", note.note);
      newNoteElement.setAttribute("note-username", note.username);
      newNoteElement.innerHTML = `<h2 class="name">${note.username}</h2>
              <h3 class="title">${note.title}</h3>
              <p class="text">${note.note}</p>            
              <button class="deleteBtn Btn">Delete Note</button>
              <button class="updateBtn Btn">Update Note</button>`;
  
      notesSection.appendChild(newNoteElement);
    });
  
    document.querySelectorAll(".deleteBtn").forEach((deleteButton) => {
      deleteButton.addEventListener("click", () => {
        const parentNode = deleteButton.parentNode as HTMLElement;
        const noteID = parentNode?.getAttribute("note-id");
        deleteNoteById(noteID);
        parentNode?.remove();
      });
    });
  
    document.querySelectorAll(".updateBtn").forEach((updateButton) => {
      updateButton.addEventListener("click", () => {
        const parentNode = updateButton.parentNode as HTMLElement;
        const noteID = parentNode?.getAttribute("note-id");
        const noteTitle = parentNode?.getAttribute("note-title");
        const noteNewNote = parentNode?.getAttribute("note-note");
        const noteUsername = parentNode?.getAttribute("note-username");
  
        const updatedNote = {
          username: noteUsername,
          title: noteTitle,
          note: noteNewNote,
          id: noteID,
        } as Note;
  
        // Call the updateNote function with the note ID
        updateNoteContent(updatedNote);
      });
    });
  }
