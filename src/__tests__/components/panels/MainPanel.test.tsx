import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainPanel } from '../../../components/panels/MainPanel';
import AuthContext from '../../../context/auth';

describe('Main Component', () => {
  const renderComponent = (authenticated: boolean) => {
    return render(
      <AuthContext.Provider
        value={{ authenticated, accessToken: '', currentUser: '' }}
      >
        <MainPanel>
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
});
