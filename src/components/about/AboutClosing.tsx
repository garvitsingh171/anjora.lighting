export function AboutClosing() {
  return (
    <section className="about-closing" aria-labelledby="about-closing-title">
      <div className="about-closing__inner container">
        <p className="eyebrow" data-closing-copy>The idea at the centre of the practice</p>
        <h2 id="about-closing-title" className="display-title" aria-label="Lighting isn’t just illumination. It’s experience.">
          <span><span data-closing-line>Lighting isn’t</span></span>
          <span><span data-closing-line>just illumination.</span></span>
          <span className="about-closing__accent"><span data-closing-line>It’s experience.</span></span>
        </h2>
        <div className="about-closing__rule" data-closing-rule />
      </div>
    </section>
  )
}
