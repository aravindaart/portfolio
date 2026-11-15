"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface ChatOverlayContextValue {
  open: boolean;
  /** Opens the overlay; optionally queues a question to send on open. */
  openChat: (initialQuestion?: string) => void;
  closeChat: () => void;
  /** One-shot: the overlay consumes this after sending it. */
  pendingQuestion: string | null;
  consumePendingQuestion: () => void;
}

const ChatOverlayContext = createContext<ChatOverlayContextValue>({
  open: false,
  openChat: () => {},
  closeChat: () => {},
  pendingQuestion: null,
  consumePendingQuestion: () => {},
});

export function ChatOverlayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  const openChat = useCallback((initialQuestion?: string) => {
    if (initialQuestion) setPendingQuestion(initialQuestion);
    setOpen(true);
  }, []);

  const closeChat = useCallback(() => setOpen(false), []);
  const consumePendingQuestion = useCallback(
    () => setPendingQuestion(null),
    [],
  );

  const value = useMemo(
    () => ({ open, openChat, closeChat, pendingQuestion, consumePendingQuestion }),
    [open, openChat, closeChat, pendingQuestion, consumePendingQuestion],
  );

  return (
    <ChatOverlayContext.Provider value={value}>
      {children}
    </ChatOverlayContext.Provider>
  );
}

export function useChatOverlay(): ChatOverlayContextValue {
  return useContext(ChatOverlayContext);
}
