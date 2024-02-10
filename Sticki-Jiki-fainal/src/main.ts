import axios from "axios";
import apiBaseUrl from "./API/apiConfig";
import { Note, ApiResponse } from "./types/interfaces";

// Välj knappen som används för att visa anteckningar
const showNoteBtn = document.querySelector(".form__btnShowNote") as HTMLElement;
let currentUser: string = "";

// Funktion för att hantera att skicka in en anteckning
async function postNote() {
  const titleInput = document.querySelector(".form__title") as HTMLInputElement;
  const noteInput = document.querySelector(".form__note") as HTMLInputElement;
  const userInput = document.querySelector(".form__user") as HTMLInputElement;
  const submitBtn = document.querySelector(".form__btn") as HTMLElement;

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const note = {
      username: userInput.value,
      title: titleInput.value,
      note: noteInput.value,
    } as Note;

    try {
      await axios.post(`${apiBaseUrl}/api/notes`, note, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Hämta och visa anteckningar omedelbart efter att ha lagt till en ny anteckning
      getNotes(note.username);
    } catch (error) {
      console.error("Misslyckades med att posta anteckning:", error);
    }
  });

  console.log(currentUser);

  // Händelselyssnare för att visa anteckningar
  showNoteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Hämta och visa anteckningar omedelbart när knappen klickas på
    getNotes(userInput.value);
  });
}

// Funktion för att hämta anteckningar från API:et
async function getNotes(username: string): Promise<ApiResponse> {
  const url = `${apiBaseUrl}/api/notes/${username}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const notes: Note[] = response.data.notes;

    displayNotes(notes);

    currentUser = username;

    // Returnera en ApiResponse även om du inte använder den här
    return {
      success: true,
      notes: notes,
    };
  } catch (error) {
    console.log(error);

    // Returnera en ApiResponse även om du inte använder den här
    return {
      success: false,
      notes: [], // eller en tom array beroende på ditt behov
    };
  }
}

// Funktion för att visa anteckningar på sidan
function displayNotes(notes: Note[]) {
  const notesArticle = document.querySelector(".notes-article") as HTMLElement;

  // Rensa befintliga anteckningar
  notesArticle.innerHTML = "";

  notes.forEach((note) => {
    const newNoteArticle = document.createElement("article");

    newNoteArticle.setAttribute("note-id", note.id);
    newNoteArticle.setAttribute("note-title", note.title);
    newNoteArticle.setAttribute("note-note", note.note);
    newNoteArticle.setAttribute("note-username", note.username);
    newNoteArticle.innerHTML = `<h2 class="name">${note.username}</h2>
            <h3 class="title">${note.title}</h3>
            <p class="text">${note.note}</p>            
            <button class="deleteBtn Btn">Delete Note</button>
            <button class="updateBtn Btn">Update Note</button>`;

    notesArticle.appendChild(newNoteArticle);
  });

  document.querySelectorAll(".deleteBtn").forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      const parentNode = deleteButton.parentNode as HTMLElement;
      const noteID = parentNode?.getAttribute("note-id");
      deleteNote(noteID);
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

      // Anropa updateNote-funktionen med antecknings-ID
      updateNote(updatedNote);
    });
  });
}

// Funktion för att uppdatera en anteckning
async function updateNote(data: Note | null) {
  if (!data) {
    console.error("Saknar parametrar för att uppdatera anteckning.");
    return;
  }

  try {
    // Be användaren att ange den uppdaterade anteckningen
    const updatedNote = prompt("Ange uppdaterad anteckning:", data.note);

    if (updatedNote !== null) {
      // Skicka PUT-begäran med det uppdaterade innehållet
      await axios.put(
        `${apiBaseUrl}/api/notes/${data.id}`,
        { note: updatedNote },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Hämta och visa uppdaterade anteckningar efter ändringar i API:et
      getNotes(data.username);
    }
  } catch (error) {
    console.log(error);
  }
}

// Funktion för att ta bort en anteckning
async function deleteNote(id: string | null) {
  const URL = `${apiBaseUrl}/api/notes/${id}`;
  try {
    await axios.delete(URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
}

// Anropa postNote för att starta applikationen
postNote();
