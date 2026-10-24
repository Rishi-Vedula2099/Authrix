import { create } from 'zustand';

interface EditorState {
  content: string;
  wordCount: number;
  setContent: (content: string) => void;
  clearContent: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '',
  wordCount: 0,
  setContent: (content) => {
    // Basic word count calculation (splitting by whitespace)
    const words = content.trim().split(/\s+/);
    const count = content.trim() === '' ? 0 : words.length;
    set({ content, wordCount: count });
  },
  clearContent: () => set({ content: '', wordCount: 0 }),
}));
