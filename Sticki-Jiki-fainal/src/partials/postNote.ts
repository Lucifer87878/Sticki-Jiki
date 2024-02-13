import axios from "axios";
import BaseUrl from "../API/apiConfig";
import { Note } from "./types/interfaces";
import { getNotes } from "./getNotes";


// Function to handle posting a note
export async function postNewNote() {
    const titleInput = document.querySelector(".form__title") as HTMLInputElement;
    const noteInput = document.querySelector(".form__note") as HTMLInputElement;
    const userInput = document.querySelector(".form__user") as HTMLInputElement;
    const submitButton = document.querySelector(".form__btn") as HTMLElement;
    const showNotesButton = document.querySelector(".form__btnShowNote") as HTMLElement;
  
    submitButton.addEventListener("click", async (e) => {
      e.preventDefault();
  
      const newNote = {
        username: userInput.value,
        title: titleInput.value,
        note: noteInput.value,
      } as Note;
  
      try {
        await axios.post(`${BaseUrl}/api/notes`, newNote, {
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
      getNotes(userInput.value);
    });
  }