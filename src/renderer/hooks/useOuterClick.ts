import { useEffect, useRef } from 'react';

export default function useOuterClick<T extends HTMLElement>(callback: () => void) {
  const callbackRef = useRef<() => void | null>();
  const innerRef = useRef<T>(null);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleClick(e: Event) {
      if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target as Node))
        callbackRef.current();
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return innerRef;
}
