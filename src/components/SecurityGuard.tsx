'use client';

import { useEffect } from 'react';

export default function SecurityGuard() {
  useEffect(() => {
    // Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable Copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Disable Select
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // Anti-screenshot mechanism (Print Screen key)
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('Screenshots are disabled on CyberKarma.');
        alert('Screenshots are disabled to protect the quiz integrity.');
      }
    };
    
    // Also try to prevent Mac screenshot shortcuts if possible (Cmd+Shift+3/4)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'c' || e.key === 's' || e.key === 'p')) {
        e.preventDefault();
      }
      if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
        // We can't actually intercept OS-level screenshot shortcuts on Mac via preventDefault easily, 
        // but we can try to clear clipboard or show an overlay.
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `}} />
  );
}
