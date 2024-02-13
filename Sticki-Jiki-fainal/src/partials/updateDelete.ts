import axios from "axios";
import BaseUrl from "../API/apiConfig";
import { Note } from "./types/interfaces";
import { getNotes } from "./getNotes";



// Function to update a note
export async function updateNoteContent(data: Note | null) {
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
          `${BaseUrl}/api/notes/${data.id}`,
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
  export async function deleteNoteById(id: string | null) {
    const URL = `${BaseUrl}/api/notes/${id}`;
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