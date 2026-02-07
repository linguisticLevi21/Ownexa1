import { useNavigate } from "react-router-dom";
import "../../Styles/Components/Loaders/NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="nf-wrap">
      <div className="nf-frame">
        <div className="nf-card">
          <div className="nf-brand">
            <span className="nf-brandName">OWNEXA</span>
          </div>

          {/* floating bugs */}
          <span className="nf-bug nf-bug1">🪲</span>
          <span className="nf-bug nf-bug2">🪲</span>
          <span className="nf-bug nf-bug3">🪲</span>
          <span className="nf-bug nf-bug4">🪲</span>

          <div className="nf-hero">
            <div className="nf-four nf-left">4</div>

            <div className="nf-mid">
              <div className="nf-bar nf-barTop" />
              <div className="nf-emoji" aria-hidden>
                😬
              </div>
              <div className="nf-bar nf-barBot" />
            </div>

            <div className="nf-four nf-right">4</div>
          </div>

          <p className="nf-text">
            The page you’re looking for can’t be found. It looks like you’re trying
            to access a page that either has been deleted or never existed…
          </p>

          <button className="nf-btn" onClick={() => navigate("/")}>
            HOME PAGE
          </button>

          <div className="nf-foot">
            <span>© {new Date().getFullYear()} OWNEXA</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </section>
  );
}