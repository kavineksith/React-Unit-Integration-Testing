import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

/**
 * ===================================================================================
 * IMPORTANT: INTEGRATION TEST AGAINST A REAL BACKEND
 * ===================================================================================
 * This test suite is designed to run against a LIVE, running backend server.
 * - It assumes your API is available at http://localhost:8080.
 * - It will create, update, and delete real data.
 * - These tests are slower and more brittle than unit tests but provide the highest
 *   confidence that the frontend and backend are integrated correctly.
 *
 * Before running:
 * 1. Make sure your backend server is running.
 * 2. The server should be in a clean or predictable state.
 * ===================================================================================
 */

describe('App Component - Full CRUD Integration Test', () => {
    // Use a unique email for each test run to prevent collisions
    const testTimestamp = Date.now();
    const testUserEmail = `integration.test.${testTimestamp}@example.com`;
    const testUserName = 'Integration Test User';
    const testUserPassword = 'StrongPassword123!';
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        // Set up user-event
        user = userEvent.setup();

        // Polyfill for matchMedia which is used by some libraries but not implemented in JSDOM
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(), // deprecated
                removeListener: vi.fn(), // deprecated
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    it('should perform a full Create, Read, Update, and Delete user cycle', async () => {
        render(<App />);

        // ------------------------------------
        // 1. Initial State & READ
        // ------------------------------------
        // Initially, it should show loading, then the user list.
        expect(screen.getByText(/loading users.../i)).toBeInTheDocument();

        // Wait for the initial user fetch to complete.
        // We expect to find the main heading after loading is done.
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /user management/i })).toBeInTheDocument();
        });
        
        // Verify the user we are about to create does NOT exist
        expect(screen.queryByText(testUserEmail)).not.toBeInTheDocument();

        // ------------------------------------
        // 2. CREATE User
        // ------------------------------------
        // Click the "Create User" button in the header (first button)
        const headerCreateButton = screen.getAllByRole('button', { name: /create user/i })[0];
        await user.click(headerCreateButton);

        // A modal should appear with the title "Create New User"
        const createModalTitle = await screen.findByRole('heading', { name: /create new user/i });
        expect(createModalTitle).toBeInTheDocument();

        // Fill out the form
        await user.type(screen.getByLabelText(/name/i), testUserName);
        await user.type(screen.getByLabelText(/email/i), testUserEmail);
        await user.type(screen.getByLabelText(/password/i), testUserPassword);
        
        // Submit the form - find the form and get its submit button
        const modal = screen.getByRole('dialog');
        const submitButton = within(modal).getByRole('button', { name: /create user/i });
        await user.click(submitButton);
        
        // Wait for the success toast and for the user to appear in the list
        await screen.findByText('User created successfully!');
        const newUserEmailCell = await screen.findByText(testUserEmail);
        expect(newUserEmailCell).toBeInTheDocument();
        
        // ------------------------------------
        // 3. UPDATE User
        // ------------------------------------
        const updatedUserName = 'Updated Test User Name';
        const userRow = newUserEmailCell.closest('tr');
        if (!userRow) throw new Error('Could not find user row');

        const editButton = userRow.querySelector('[aria-label*="Edit"]');
        if (!editButton) throw new Error('Could not find edit button');
        
        await user.click(editButton);

        // A modal should appear with the title "Edit User"
        await screen.findByRole('heading', { name: /edit user/i });

        // Update the name
        const nameInput = screen.getByLabelText(/name/i);
        await user.clear(nameInput);
        await user.type(nameInput, updatedUserName);

        // Submit the update
        const editModal = screen.getByRole('dialog');
        const updateButton = within(editModal).getByRole('button', { name: /update user/i });
        await user.click(updateButton);
        
        // Wait for the success toast and for the updated name to appear
        await screen.findByText('User updated successfully!');
        expect(await screen.findByText(updatedUserName)).toBeInTheDocument();
        expect(screen.queryByText(testUserName)).not.toBeInTheDocument(); // Old name should be gone

        // ------------------------------------
        // 4. DELETE User
        // ------------------------------------
        const updatedUserRow = (await screen.findByText(updatedUserName)).closest('tr');
        if (!updatedUserRow) throw new Error('Could not find updated user row');

        const deleteButton = updatedUserRow.querySelector('[aria-label*="Delete"]');
        if (!deleteButton) throw new Error('Could not find delete button');
        
        await user.click(deleteButton);
        
        // A confirmation modal should appear
        await screen.findByRole('heading', { name: /delete user/i });
        expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();

        // Confirm deletion - find the delete button within the modal
        const deleteModal = screen.getByRole('dialog');
        const confirmDeleteButton = within(deleteModal).getByRole('button', { name: /^delete$/i });
        await user.click(confirmDeleteButton);
        
        // Wait for the success toast and for the user to be removed from the list
        await screen.findByText('User deleted successfully!');
        
        await waitFor(() => {
            expect(screen.queryByText(updatedUserName)).not.toBeInTheDocument();
            expect(screen.queryByText(testUserEmail)).not.toBeInTheDocument();
        });
    }, 30000); // Increase timeout for this test as it hits a real API
});