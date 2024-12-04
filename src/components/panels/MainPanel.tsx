import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import junityLogoSvg from '../../../assets/junity-logo.svg';
import { LabIcon } from '@jupyterlab/ui-components';

const junityIcon = new LabIcon({
  name: 'junity:logo-large',
  svgstr: junityLogoSvg
});

interface MainContainerProps {
  children: React.ReactNode;
}

export const MainPanel: React.FC<MainContainerProps> = ({ children }) => {
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      junityIcon.element({
        container: iconRef.current,
        height: '20px',
        width: '100px',
        marginLeft: '0'
      });
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '5px',
          backgroundColor: 'lightblue',
          borderBottom: '1px solid #ccc',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: 0
          }}
        >
          <span ref={iconRef}></span>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, padding: 0 }}>{children}</Box>
    </Box>
  );
};
