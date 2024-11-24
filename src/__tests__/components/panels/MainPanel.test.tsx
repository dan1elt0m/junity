import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainPanel } from '../../../components/panels/MainPanel';
import AuthContext from '../../../context/auth';

describe('Main Component', () => {
  const mockLogout = jest.fn();

  const renderComponent = (authenticated: boolean) => {
    return render(
      <AuthContext.Provider
        value={{ authenticated, accessToken: '', currentUser: '' }}
      >
        <MainPanel onLogout={mockLogout}>
          <div>Child Content</div>
        </MainPanel>
      </AuthContext.Provider>
    );
  };

  it('should render the logo', () => {
    const { container } = renderComponent(false);
    console.log(container.innerHTML); // Log the rendered HTML

    const logoContainer = container.querySelector('span');
    expect(logoContainer).toBeInTheDocument();
  });

  it('should render children content', () => {
    renderComponent(false);
    const childContent = screen.getByText('Child Content');
    expect(childContent).toBeInTheDocument();
  });

  it('should render logout button when authenticated', () => {
    renderComponent(true);
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('should not render logout button when not authenticated', () => {
    renderComponent(false);
    const logoutButton = screen.queryByRole('button', { name: /logout/i });
    expect(logoutButton).not.toBeInTheDocument();
  });

  it('should call onLogout when logout button is clicked', () => {
    renderComponent(true);
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
