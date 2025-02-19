import { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';

export function useQuillEditor() {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    // Configuration initiale si nécessaire
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.root.setAttribute('spellcheck', 'false');
    }
  }, []);

  return quillRef;
}