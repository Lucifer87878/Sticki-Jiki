// Define an interface for the note object
export interface Note {
    id: string;
    username: string;
    title: string;
    note: string;
}

export interface ApiResponse {
    success: boolean;
    notes: Note[];
}

export interface ApiError <T, D> {
    message: T;
    status: D;
  }



