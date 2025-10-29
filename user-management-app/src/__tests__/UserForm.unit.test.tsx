import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm from '../components/UserForm';
import { mockUsers } from './mocks/users';

describe('UserForm Component Unit Tests', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    const user = userEvent.setup();

    beforeEach(() => {
        mockOnSubmit.mockClear();
        mockOnCancel.mockClear();
    });

    it('should render an empty form for creating a new user', () => {
        render(<UserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={false} />);

        expect(screen.getByLabelText(/name/i)).toHaveValue('');
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
        expect(screen.getByLabelText(/password/i)).toHaveValue('');
        expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).not.toBeDisabled();
    });

    it('should render a pre-filled form for editing a user', () => {
        const userToEdit = mockUsers[0];
        render(<UserForm userToEdit={userToEdit} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={false} />);

        expect(screen.getByLabelText(/name/i)).toHaveValue(userToEdit.name);
        expect(screen.getByLabelText(/email/i)).toHaveValue(userToEdit.email);
        expect(screen.getByLabelText(/email/i)).toBeDisabled(); // Email should not be editable
        expect(screen.getByPlaceholderText(/leave blank to keep current password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /update user/i })).toBeInTheDocument();
    });

    it('should call onCancel when the cancel button is clicked', async () => {
        render(<UserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={false} />);
        
        await user.click(screen.getByRole('button', { name: /cancel/i }));

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onSubmit with the correct data when creating a user', async () => {
        render(<UserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={false} />);
        
        await user.type(screen.getByLabelText(/name/i), 'Test User');
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), 'Password123!');
        
        await user.click(screen.getByRole('button', { name: /create user/i }));

        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123!',
        }, undefined);
    });

    it('should call onSubmit without the password if it is not provided during an update', async () => {
        const userToEdit = mockUsers[0];
        render(<UserForm userToEdit={userToEdit} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={false} />);

        await user.clear(screen.getByLabelText(/name/i));
        await user.type(screen.getByLabelText(/name/i), 'Updated Name');
        
        await user.click(screen.getByRole('button', { name: /update user/i }));

        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith({
            name: 'Updated Name',
            email: userToEdit.email,
        }, userToEdit.email);
    });

     it('should disable buttons when isLoading is true', () => {
        render(<UserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={true} />);

        expect(screen.getByRole('button', { name: /saving.../i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });
});
