import React from 'react';

interface Component1Props {
  title: string;
  onClick: () => void;
}

const Component1: React.FC<Component1Props> = ({ title, onClick }) => {
  return (
    <div className="component1">
      <h1>{title}</h1>
      <button onClick={onClick}>Click Me</button>
    </div>
  );
};

export default Component1;