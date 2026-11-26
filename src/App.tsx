import { useCallback, useEffect, useState } from "react";
import {
  applyDialogueRequestToInterest,
  useDialogueInterest,
} from "./context/DialogueInterestContext";
import { Layout } from "./components/Layout";
import { HomeView } from "./views/HomeView";
import { PracticeView } from "./views/PracticeView";
import { JourneyView } from "./views/JourneyView";
import { DialogueView } from "./views/DialogueView";
import type { DialogueRequest, ViewId } from "./types";

export default function App() {
  const [view, setView] = useState<ViewId>(() =>
    window.location.hash === "#journey" ? "journey" : "home",
  );

  useEffect(() => {
    function restoreJourney() {
      setView((current) =>
        window.location.hash === "#journey" ? "journey" : current === "journey" ? "home" : current,
      );
    }
    window.addEventListener("hashchange", restoreJourney);
    return () => window.removeEventListener("hashchange", restoreJourney);
  }, []);

  const navigate = useCallback((next: ViewId) => {
    const url = new URL(window.location.href);
    if (next === "journey") url.hash = "journey";
    else if (url.hash === "#journey") url.hash = "";
    if (url.href !== window.location.href) window.history.pushState(null, "", url);
    setView(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
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
      navigate("dialogue");
    },
    [dialogueInterest, navigate],
  );

  const clearDialogueRequest = useCallback(() => {
    setDialogueRequest(null);
  }, []);

  return (
    <Layout view={view} onNavigate={navigate}>
      {view === "home" && (
        <HomeView onNavigate={navigate} onOpenDialogue={openDialogue} />
      )}
      {view === "journey" && <JourneyView />}
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
