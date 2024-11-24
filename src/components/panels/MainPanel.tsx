// src/components/mainContainer.tsx
import React, { useContext, useEffect, useRef } from 'react';
import AuthContext from '../../context/auth';
import '../../../style/menu.css';
import junityLogoSvg from '../../../assets/junity-logo.svg';
import { LabIcon } from '@jupyterlab/ui-components';
import { logoutIcon } from '../../style/icons';

const junityIcon = new LabIcon({
  name: 'junity:logo-large',
  svgstr: junityLogoSvg
});

interface MainContainerProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const MainPanel: React.FC<MainContainerProps> = ({
  children,
  onLogout
}) => {
  const authContext = useContext(AuthContext);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      junityIcon.element({
        container: iconRef.current,
        height: '30px',
        width: '150px',
        marginLeft: '2px'
      });
    }
  }, []);

  return (
    <div className="main-container">
      <div className="header">
        <div className="inner">
          <span ref={iconRef}></span>
        </div>
        {authContext.authenticated && (
          <button
            className="logout-button"
            onClick={onLogout}
            aria-label="logout"
            title="Logout"
          >
            <logoutIcon.react width={16} height={16} />
          </button>
        )}
      </div>
      <div className="content">{children}</div>
    </div>
  );
};
