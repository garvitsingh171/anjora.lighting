import { clientReelUrl } from '../../data/contacts'
import './InstagramReel.css'

export function InstagramReel() {
  return (
    <section className="instagram-reel container" aria-labelledby="instagram-reel-title">
      <p className="eyebrow">In motion</p>
      <div><h2 id="instagram-reel-title" className="display-title">A moment to explore.</h2><p>View the reel on Instagram.</p></div>
      <a className="text-link" href={clientReelUrl} target="_blank" rel="noopener noreferrer">Watch on Instagram <span className="sr-only">(opens in a new tab)</span></a>
    </section>
  )
}
