import React from 'react';

interface UserInformationProps {
  onBack: () => void;
}

export const UserInformation: React.FC<UserInformationProps> = ({ onBack }) => {
  return (
    <div>
      <button onClick={onBack}>Back</button>
      <div>
        <h2>User Information</h2>
        {/* Render user information here */}
      </div>
    </div>
  );
};