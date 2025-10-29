
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from './services/api';
import type { User, UserRequestDTO, ApiError } from './types';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import Modal from './components/Modal';
import Toast from './components/Toast';
import { PlusIcon, ExclamationTriangleIcon, MagnifyingGlassIcon } from './components/icons';

type ModalMode = 'inactive' | 'create' | 'edit' | 'delete' | 'view';
type ToastState = { message: string; type: 'success' | 'error' } | null;

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('inactive');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to fetch users. Please check the API connection.';
        setApiError(message);
        setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) {
      return users;
    }
    return users.filter(user =>
      user.name.toLowerCase().includes(lowercasedQuery) ||
      user.email.toLowerCase().includes(lowercasedQuery)
    );
  }, [users, searchQuery]);

  const handleShowToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleCloseModal = () => {
    setModalMode('inactive');
    setCurrentUser(null);
  };

  const handleCreateUserClick = () => {
    setModalMode('create');
  };

  const handleEditUserClick = (user: User) => {
    setCurrentUser(user);
    setModalMode('edit');
  };

  const handleDeleteUserClick = (user: User) => {
    setCurrentUser(user);
    setModalMode('delete');
  };

  const handleViewUserClick = (user: User) => {
    setCurrentUser(user);
    setModalMode('view');
  };

  const handleFormSubmit = async (userData: UserRequestDTO, originalEmail?: string) => {
    setIsSubmitting(true);
    try {
      if (modalMode === 'edit' && originalEmail) {
        await updateUser(originalEmail, userData);
        handleShowToast('User updated successfully!', 'success');
      } else {
        await createUser(userData);
        handleShowToast('User created successfully!', 'success');
      }
      handleCloseModal();
      fetchUsers();
    } catch (error: any) {
      const errData = error.response?.data as ApiError;
      const message = errData?.message || `Failed to ${modalMode === 'edit' ? 'update' : 'create'} user.`;
      const details = errData.details ? ` Details: ${errData.details.join(', ')}` : '';
      handleShowToast(message + details, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      await deleteUser(currentUser.email);
      handleShowToast('User deleted successfully!', 'success');
      handleCloseModal();
      fetchUsers();
    } catch (error: any) {
      handleShowToast(error.response?.data?.message || 'Failed to delete user.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case 'create': return 'Create New User';
      case 'edit': return 'Edit User';
      case 'delete': return 'Delete User';
      case 'view': return 'User Details';
      default: return '';
    }
  };
  
  return (
    <div className="min-h-screen bg-light dark:bg-secondary text-gray-800 dark:text-gray-200">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Modal isOpen={modalMode !== 'inactive'} onClose={handleCloseModal} title={getModalTitle()}>
        {modalMode === 'create' || modalMode === 'edit' ? (
          <UserForm 
            userToEdit={currentUser} 
            onSubmit={handleFormSubmit} 
            onCancel={handleCloseModal}
            isLoading={isSubmitting}
          />
        ) : modalMode === 'delete' ? (
          <div>
            <div className="flex items-center space-x-3">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <p>Are you sure you want to delete <strong>{currentUser?.name}</strong>?</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">This action cannot be undone.</p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
                onClick={handleConfirmDelete}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                <dd className="mt-1 text-lg text-gray-900 dark:text-white">{currentUser?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</dt>
                <dd className="mt-1 text-lg text-gray-900 dark:text-white">{currentUser?.email}</dd>
              </div>
            </dl>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">User Management</h1>
                    <p className="mt-1 text-md text-gray-500 dark:text-gray-400">A dashboard to manage all user accounts.</p>
                </div>
                <button
                    onClick={handleCreateUserClick}
                    className="mt-4 sm:mt-0 flex-shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover focus:ring-4 focus:ring-primary-focus focus:outline-none"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create User
                </button>
            </div>
            <div className="mt-6 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    name="search"
                    id="search"
                    className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search users"
                />
            </div>
        </header>

        <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow-lg">
          {isLoading ? (
            <div className="text-center py-16">Loading users...</div>
          ) : apiError ? (
            <div className="text-center py-16 text-red-500">{apiError}</div>
          ) : (
            <UserList users={filteredUsers} onViewUser={handleViewUserClick} onEditUser={handleEditUserClick} onDeleteUser={handleDeleteUserClick} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
