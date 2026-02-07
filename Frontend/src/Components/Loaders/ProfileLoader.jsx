import "../../Styles/Components/Loaders/ProfileLoader.css";

export default function ReactorOrbitLoader({ label }) {
  return (
    <div className="rol-wrap" role="status" aria-live="polite" aria-busy="true">
      <div className="rol-core">
        {/* Orbit rings */}
        <span className="rol-ring rol-ring-1" />
        <span className="rol-ring rol-ring-2" />
        <span className="rol-ring rol-ring-3" />

        {/* ETH diamond */}
        <div className="rol-eth" aria-hidden="true">
          <div className="rol-eth-top" />
          <div className="rol-eth-bottom" />
        </div>

        {/* Candlestick pulse */}
        <div className="rol-candles" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="rol-candle" />
          ))}
        </div>
      </div>

      <div className="rol-text">{label}</div>
    </div>
  );
}