'use client';

import { useEffect } from 'react';

export default function SecurityGuard() {
  useEffect(() => {
    // Soft anti-screenshot notification (PrintScreen key)
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('Screenshots are disabled on CyberKarma.').catch(() => {});
      }
    };

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // User-select is no longer globally disabled — allows recruiters to copy contact info
  // and users to copy quiz content or legal policy text
  return null;
}
