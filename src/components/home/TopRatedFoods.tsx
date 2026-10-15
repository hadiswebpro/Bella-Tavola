import "./TopRatedFoods.css";
export default function TopRatedFoods() {
  return (
    <section className="story-section" id="story" aria-labelledby="story-title">
      <div className="story-section__visual" aria-hidden="true">
        <div className="story-visual__halo"></div>
        <div className="story-visual__plate">
          <span>
            Buon
            <br />
            appetito
          </span>
          <span className="story-visual__leaf">✳</span>
        </div>
        <span className="story-visual__note story-visual__note--top">
          Fatto con amore
        </span>
        <span className="story-visual__note story-visual__note--bottom">
          Gather • Share • Savour
        </span>
        <span className="story-visual__spark story-visual__spark--one">✦</span>
        <span className="story-visual__spark story-visual__spark--two">✧</span>
      </div>

      <div className="story-section__content">
        <p className="eyebrow">
          <span aria-hidden="true">✳</span> La dolce vita — the sweet life
        </p>
        <h2 id="story-title">
          More than a meal.
          <br />A place to <span>belong.</span>
        </h2>
        <p className="story-section__lead">
          Italian comfort food, fresh flavours, and a warm table made for
          sharing.
        </p>
        <div className="story-values story-values--compact">
          <span>Made with care</span>
          <span>Best shared together</span>
          <span>Always room for one more</span>
        </div>

        <a className="story-section__cta" href="#menu">
          Find your favourite <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
