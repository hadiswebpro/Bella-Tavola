import "./SpecialOffers.css";
type Props = { onClose: () => void; onNotice: (message: string) => void };
export default function SpecialOffers({ onClose, onNotice }: Props) {
  return (
    <aside className="promo-banner" aria-label="Special offer">
      <div className="promo-banner__inner">
        <span className="promo-banner__sparkle" aria-hidden="true">
          ✦
        </span>
        <div className="promo-banner__message">
          <span className="promo-banner__eyebrow">A little treat from us</span>
          <p>
            <strong>Take 10% off</strong> your food order with code{" "}
            <strong className="promo-banner__code">BELLA10</strong>
          </p>
        </div>
        <button
          className="promo-banner__button"
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText("BELLA10");
              onNotice("Promo code BELLA10 copied!");
            } catch {
              onNotice("Use promo code BELLA10 at checkout.");
            }
          }}
        >
          Copy code <span aria-hidden="true">↗</span>
        </button>
        <button
          className="promo-banner__close"
          type="button"
          aria-label="Dismiss special offer"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </aside>
  );
}
