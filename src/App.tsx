import { useCallback, useState } from "react";
import {
  applyDialogueRequestToInterest,
  useDialogueInterest,
} from "./context/DialogueInterestContext";
import { Layout } from "./components/Layout";
import { HomeView } from "./views/HomeView";
import { PracticeView } from "./views/PracticeView";
import { DialogueView } from "./views/DialogueView";
import type { DialogueRequest, ViewId } from "./types";

export default function App() {
  const [view, setView] = useState<ViewId>("home");
  const [dialogueRequest, setDialogueRequest] = useState<DialogueRequest | null>(
    null,
  );
  const dialogueInterest = useDialogueInterest();

  const openDialogue = useCallback(
    (request: Omit<DialogueRequest, "id">) => {
      applyDialogueRequestToInterest(dialogueInterest, request);
      setDialogueRequest({
        id: crypto.randomUUID(),
        autoSend: true,
        ...request,
      });
      setView("dialogue");
    },
    [dialogueInterest],
  );

  const clearDialogueRequest = useCallback(() => {
    setDialogueRequest(null);
  }, []);

  return (
    <Layout view={view} onNavigate={setView}>
      {view === "home" && (
        <HomeView onNavigate={setView} onOpenDialogue={openDialogue} />
      )}
      {view === "practice" && <PracticeView onOpenDialogue={openDialogue} />}
      {view === "dialogue" && (
        <DialogueView
          pendingRequest={dialogueRequest}
          onRequestHandled={clearDialogueRequest}
        />
      )}
    </Layout>
  );
}
