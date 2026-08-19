type Listener = (activeId: string | null) => void;

let activeId: string | null = null;
const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) listener(activeId);
}

export function claimVideoAudio(id: string) {
  if (activeId === id) return;
  activeId = id;
  notify();
}

export function releaseVideoAudio(id: string) {
  if (activeId !== id) return;
  activeId = null;
  notify();
}

export function subscribeVideoAudio(listener: Listener) {
  listeners.add(listener);
  listener(activeId);
  return () => {
    listeners.delete(listener);
  };
}
