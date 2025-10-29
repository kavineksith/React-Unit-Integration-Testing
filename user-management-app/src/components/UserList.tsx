
import React from 'react';
import type { User } from '../types';
import UserListItem from './UserListItem';

interface UserListProps {
  users: User[];
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onViewUser, onEditUser, onDeleteUser }) => {
    if (users.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Users Found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Your search returned no results, or you haven't created any users yet.</p>
            </div>
        );
    }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserListItem key={user.id} user={user} onView={onViewUser} onEdit={onEditUser} onDelete={onDeleteUser} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
