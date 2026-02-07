import { TrendingUp, ArrowRight, Wallet, Gem } from "lucide-react";
import "../../Styles/Components/Loaders/MarketLoader.css";

export default function MarketMiniLoader({ text = "Fetching market..." }) {
  return (
    <div className="mml-wrap">
      <div className="mml-row" aria-label={text}>
        <TrendingUp className="mml-ico mml-a" size={18} />
        <ArrowRight className="mml-ico mml-arrow mml-b" size={18} />
        <Wallet className="mml-ico mml-c" size={18} />
        <ArrowRight className="mml-ico mml-arrow mml-d" size={18} />
        <Gem className="mml-ico mml-e" size={18} />
      </div>
      <div className="mml-text">{text}</div>
    </div>
  );
}