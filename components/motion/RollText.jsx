export default function RollText({ children }) {
  const text = String(children);
  return (
    <span className="roll-label">
      <span className="sr-only">{text}</span>
      <span className="roll-line roll-primary" aria-hidden="true">
        {[...text].map((c, i) => (
          <span className="roll-char" style={{ "--char-index": i }} key={i}>
            {c === " " ? "\u00a0" : c}
          </span>
        ))}
      </span>
      <span className="roll-line roll-clone" aria-hidden="true">
        {[...text].map((c, i) => (
          <span className="roll-char" style={{ "--char-index": i }} key={i}>
            {c === " " ? "\u00a0" : c}
          </span>
        ))}
      </span>
    </span>
  );
}
