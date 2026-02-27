import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note } from "../types/note";
import type { FetchNotesResponse } from "../types/fetchNotesResponse";

const API_URL = "https://notehub-public.goit.study/api/notes";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string
): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await instance.get("", {
    params: { page, perPage, search },
  });
  return response.data;
};

export const createNote = async (
  note: CreateNoteParams
): Promise<Note> => {
  try {
    console.log("Creating note:", note);
    const response: AxiosResponse<Note> = await instance.post("", note);
    console.log("Note created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await instance.delete(`/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    console.log(`Fetching note with ID: ${id}`);
    const response: AxiosResponse<Note> = await instance.get(`/${id}`);
    console.log("Note fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching note ${id}:`, error);
    throw error;
  }
};

