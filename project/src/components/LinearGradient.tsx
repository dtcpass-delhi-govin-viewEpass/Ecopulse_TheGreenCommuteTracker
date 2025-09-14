import React from 'react';

interface LinearGradientProps {
  colors: string[];
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const LinearGradient: React.FC<LinearGradientProps> = ({ colors, style, children }) => {
  const gradientStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${colors.join(', ')})`,
    ...style,
  };

  return <div style={gradientStyle}>{children}</div>;
};

export default LinearGradient;
