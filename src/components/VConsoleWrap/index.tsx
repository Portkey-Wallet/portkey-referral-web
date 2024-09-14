import React, { useState, useEffect, useRef } from 'react';
import VConsole from 'vconsole';

export const VConsoleWrap = ({ children }: { children: React.ReactNode }) => {
  const [, setClickCount] = useState(0);
  const clickTimeout = useRef<NodeJS.Timeout>();

  const clearClickTimeout = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
  };

  const handleClick = () => {
    clearClickTimeout();

    setClickCount((prev) => {
      const newCount = prev + 1;

      if (newCount === 10) {
        new VConsole();
      }

      clickTimeout.current = setTimeout(() => {
        setClickCount(0);
      }, 500);

      return newCount;
    });
  };

  useEffect(() => {
    return () => clearClickTimeout();
  }, []);

  return <div onClick={handleClick}>{children}</div>;
};

export default VConsoleWrap;
