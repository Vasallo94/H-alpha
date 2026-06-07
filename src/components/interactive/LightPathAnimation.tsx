import { useEffect, useRef, useState } from "react";

type Stage = { name: string; discards: string };

type Labels = {
  aria: string;
  play: string;
  pause: string;
  reset: string;
  stages: Stage[];
};

const INTERVAL_MS = 1200;

export function LightPathAnimation({ labels }: { labels: Labels }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start false (same as SSR) and sync to the real value after mount to
  // avoid hydration mismatches from window.matchMedia being unavailable on server.
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = () => setPrefersReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const total = labels.stages.length;

  function startInterval() {
    if (prefersReduced) return;
    intervalRef.current = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1;
        if (next >= total) {
          stopInterval();
          setPlaying(false);
          return prev;
        }
        return next;
      });
    }, INTERVAL_MS);
  }

  function stopInterval() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function handlePlayPause() {
    if (playing) {
      stopInterval();
      setPlaying(false);
    } else {
      // If at the end, restart from beginning first
      setStep((prev) => {
        const start = prev >= total - 1 ? 0 : prev;
        return start;
      });
      setPlaying(true);
    }
  }

  function handleReset() {
    stopInterval();
    setPlaying(false);
    setStep(0);
  }

  // When playing state turns true, start interval
  useEffect(() => {
    if (playing && !prefersReduced) {
      startInterval();
    }
    return () => stopInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // Clean up on unmount
  useEffect(() => () => stopInterval(), []);

  const currentStage = labels.stages[step];

  return (
    <div
      className="light-path instrument-panel"
      role="group"
      aria-label={labels.aria}
    >
      {/* Node track */}
      <div className="light-path__track" aria-hidden="true">
        {labels.stages.map((stage, i) => (
          <button
            key={stage.name}
            type="button"
            className={`light-path__node${i === step ? " light-path__node--active" : i < step ? " light-path__node--passed" : ""}`}
            onClick={() => setStep(i)}
            aria-pressed={i === step}
            tabIndex={0}
          >
            <span className="light-path__node-index">{i + 1}</span>
            <span className="light-path__node-label">{stage.name}</span>
          </button>
        ))}
        {/* Beam connectors */}
        <div className="light-path__beams" aria-hidden="true">
          {labels.stages.slice(0, -1).map((_, i) => (
            <span
              key={i}
              className={`light-path__beam${i < step ? " light-path__beam--active" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Stage description */}
      <div className="light-path__description" aria-live="polite" aria-atomic="true">
        <p className="light-path__stage-name">{currentStage.name}</p>
        <p className="light-path__stage-discards">{currentStage.discards}</p>
      </div>

      {/* Controls */}
      <div className="light-path__controls">
        <button
          type="button"
          className="light-path__btn"
          onClick={handlePlayPause}
          disabled={prefersReduced}
          aria-disabled={prefersReduced}
        >
          {playing ? labels.pause : labels.play}
        </button>
        <button
          type="button"
          className="light-path__btn light-path__btn--secondary"
          onClick={handleReset}
        >
          {labels.reset}
        </button>
      </div>
    </div>
  );
}
