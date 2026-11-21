import { Link } from 'react-router-dom'
import portrait from '../../assets/about/shubham-khandelwal.png'
import './ExperienceChooser.css'

export function PracticeIntro() {
  return <section className="practice-intro container" aria-labelledby="practice-title">
    <img src={portrait} alt="Shubham Khandelwal, Director of Anjora Lighting" width="279" height="278" loading="lazy" />
    <div><p className="eyebrow">People behind the practice</p><h2 id="practice-title" className="display-title">Engineering meets atmosphere.</h2>
      <p>Led by Shubham Khandelwal in Jaipur, Anjora brings engineering understanding, lighting-design experience and aesthetic sensitivity to each space.</p>
      <Link className="text-link" to="/about-us">Meet Anjora</Link>
    </div>
  </section>
}
