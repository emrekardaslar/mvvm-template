import { useEffect } from 'react';
import coordinator from '@application/routing/coordinator';

/**
 * Client-side component to initialize the Coordinator
 * This ensures Coordinator runs in the browser, not on the server
 */
export function CoordinatorInit() {
  useEffect(() => {
    // Coordinator is initialized when imported
    // This component just ensures the import happens on the client
    console.log('Coordinator initialized on client');
  }, []);

  // This component doesn't render anything
  return null;
}
