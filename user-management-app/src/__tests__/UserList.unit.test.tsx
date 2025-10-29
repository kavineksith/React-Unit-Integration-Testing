import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import UserList from '../components/UserList';
import { mockUsers } from './mocks/users';
import type { User } from '../types';

// Mock the UserListItem to isolate the UserList component
vi.mock('../components/UserListItem', () => ({
    __esModule: true,
    default: ({ user, onView, onEdit, onDelete }: { user: User, onView: Function, onEdit: Function, onDelete: Function }) => (
        <tr data-testid={`user-${user.id}`}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
                <button onClick={() => onView(user)}>View</button>
                <button onClick={() => onEdit(user)}>Edit</button>
                <button onClick={() => onDelete(user)}>Delete</button>
            </td>
        </tr>
    ),
}));

describe('UserList Component Unit Tests', () => {
    const mockOnView = vi.fn();
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    beforeEach(() => {
        // Clear mock history before each test
        mockOnView.mockClear();
        mockOnEdit.mockClear();
        mockOnDelete.mockClear();
    });

    it('should render a list of users correctly', () => {
        render(<UserList users={mockUsers} onViewUser={mockOnView} onEditUser={mockOnEdit} onDeleteUser={mockOnDelete} />);
        
        // Check for table headers
        expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument();

        // Check that all mock users are rendered
        expect(screen.getAllByRole('row')).toHaveLength(mockUsers.length + 1); // +1 for the header row
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
        expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });

    it('should display a "No Users Found" message when the users array is empty', () => {
        render(<UserList users={[]} onViewUser={mockOnView} onEditUser={mockOnEdit} onDeleteUser={mockOnDelete} />);

        expect(screen.getByText('No Users Found')).toBeInTheDocument();
        expect(screen.getByText(/Your search returned no results/)).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
});
