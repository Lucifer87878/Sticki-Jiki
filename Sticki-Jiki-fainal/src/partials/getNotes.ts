import axios from "axios";
import BaseUrl from "../API/apiConfig";
import { ApiResponse, ApiError, Note } from "./types/interfaces";
import { displayUserNotes } from "./displayNotes";


// Function to fetch notes from the API
export async function getNotes(username: string) {
  const url = `${BaseUrl}/api/notes/${username}`;

  try {
    const response = await axios.get<ApiResponse | ApiError<string, number>>(url);

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