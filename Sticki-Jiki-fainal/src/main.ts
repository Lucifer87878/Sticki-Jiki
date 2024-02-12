import axios from "axios";
import baseUrl from "./API/apiConfig";
import { Note, ApiResponse, ApiError } from "./types/interfaces";

// Select the button used to show notes
const showNotesButton = document.querySelector(".form__btnShowNote") as HTMLElement;
let currentUser = "";

// Function to handle posting a note
async function postNewNote() {
  const titleInput = document.querySelector(".form__title") as HTMLInputElement;
  const noteInput = document.querySelector(".form__note") as HTMLInputElement;
  const userInput = document.querySelector(".form__user") as HTMLInputElement;
  const submitButton = document.querySelector(".form__btn") as HTMLElement;

  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const newNote = {
      username: userInput.value,
      title: titleInput.value,
      note: noteInput.value,
    } as Note;

    try {
      await axios.post(`${baseUrl}/api/notes`, newNote, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Immediately fetch and display notes after adding a new note
      getNotes(newNote.username);
    } catch (error) {
      console.error("Failed to post note:", error);
    }
  });

  // Event listener to show notes
  showNotesButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Fetch and display notes immediately when the button is clicked
    getNotes(userInput.value);
  });
}

// Function to fetch notes from the API
async function getNotes(username: string) {
  const url = `${baseUrl}/api/notes/${username}`;

  try {
    const response = await axios.get<ApiResponse | ApiError>(url);

    if ('notes' in response.data) {
      const notes: Note[] = response.data.notes;
      displayUserNotes(notes);
    } else {
      console.error('Failed to get notes:', response.data.message);
    }
    
    // user = username;
  } catch (error) {
    console.log(error);
  }
}

console.log(currentUser);

// Function to display notes on the page
function displayUserNotes(notesList: Note[]) {
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

// Function to update a note
async function updateNoteContent(data: Note | null) {
  if (!data) {
    console.error("Missing parameters for updating note.");
    return;
  }

  try {
    // Prompt the user to enter the updated note
    const updatedNote = prompt("Enter updated note:", data.note);

    if (updatedNote !== null) {
      // Send PUT request with the updated content
      await axios.put(
        `${baseUrl}/api/notes/${data.id}`,
        { note: updatedNote },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Fetch and display updated notes after changes in the API
      getNotes(data.username);
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to delete a note by ID
async function deleteNoteById(id: string | null) {
  const URL = `${baseUrl}/api/notes/${id}`;
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

// Call postNewNote to start application
postNewNote();
