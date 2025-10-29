import axios from 'axios';
import type { User, UserRequestDTO } from '../types';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[] | ''>('/all');
  // If the API returns a 204 No Content, response.data could be an empty string.
  // This ensures we always return an array, preventing errors in components.
  return Array.isArray(response.data) ? response.data : [];
};

export const createUser = async (user: UserRequestDTO): Promise<void> => {
  await apiClient.post('/create', user);
};

export const updateUser = async (email: string, user: UserRequestDTO): Promise<void> => {
  await apiClient.put('/update', user, { params: { email } });
};

export const deleteUser = async (email: string): Promise<void> => {
  await apiClient.delete('/delete', { params: { email } });
};