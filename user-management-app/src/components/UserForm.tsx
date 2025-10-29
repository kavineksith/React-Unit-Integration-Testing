
import React, { useState, useEffect } from 'react';
import type { User, UserRequestDTO } from '../types';

interface UserFormProps {
  userToEdit?: User | null;
  onSubmit: (userData: UserRequestDTO, originalEmail?: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ userToEdit, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<UserRequestDTO>({
    name: '',
    email: '',
    password: '',
  });

  const isEditing = !!userToEdit;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '', // Password should be re-entered for security
      });
    } else {
        setFormData({ name: '', email: '', password: '' });
    }
  }, [userToEdit, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend: UserRequestDTO = { ...formData };
    // Only include password if it's not empty
    if (!dataToSend.password) {
      delete dataToSend.password;
    }
    onSubmit(dataToSend, userToEdit?.email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isEditing}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-600"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required={!isEditing}
          minLength={8}
          placeholder={isEditing ? 'Leave blank to keep current password' : ''}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters and include uppercase, lowercase, number, and special character.</p>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus disabled:bg-indigo-300"
        >
          {isLoading ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
