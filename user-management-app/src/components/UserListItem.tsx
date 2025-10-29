
import React from 'react';
import type { User } from '../types';
import { PencilIcon, TrashIcon, EyeIcon } from './icons';

interface UserListItemProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onView, onEdit, onDelete }) => {
  return (
    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b dark:border-gray-700">
      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {user.name}
      </td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
        {user.email}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end space-x-4">
          <button onClick={() => onView(user)} className="font-medium text-gray-500 dark:text-gray-400 hover:underline" aria-label={`View ${user.name}`}>
            <EyeIcon />
          </button>
          <button onClick={() => onEdit(user)} className="font-medium text-primary dark:text-indigo-400 hover:underline" aria-label={`Edit ${user.name}`}>
            <PencilIcon />
          </button>
          <button onClick={() => onDelete(user)} className="font-medium text-red-600 dark:text-red-500 hover:underline" aria-label={`Delete ${user.name}`}>
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserListItem;
