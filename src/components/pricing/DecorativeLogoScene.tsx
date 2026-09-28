import logo from '../../../assets/logo-removebg-640.png'
import { PricingIcon } from './PricingIcon'

/** Reuse the original header logo inside the existing decorative glass scene. */
export function DecorativeLogoScene() {
  return <div className="pricing-scene" aria-hidden="true">
    <div className="pricing-scene-haze" />
    <svg className="pricing-orbits" viewBox="0 0 460 270" fill="none">
      <ellipse cx="230" cy="207" rx="202" ry="42" stroke="#52e4aa" strokeOpacity=".17" transform="rotate(-9 230 207)" />
      <path d="M25 176C90 103 328 113 430 191M61 222C180 272 348 208 407 100" stroke="#66f1bc" strokeOpacity=".2" strokeDasharray="3 9" />
      <circle cx="65" cy="185" r="3" fill="#66f1bc" /><circle cx="397" cy="147" r="2" fill="#66f1bc" />
    </svg>
    <div className="pricing-pedestal"><span /></div>
    <div className="pricing-logo-glass">
      <img src={logo} alt="AezCheck" />
    </div>
    <div className="pricing-mini pricing-mini--chart"><PricingIcon name="chart" /><span /><span /></div>
    <div className="pricing-mini pricing-mini--shield"><PricingIcon name="shield" /></div>
    <div className="pricing-mini pricing-mini--users"><PricingIcon name="users" /><span /></div>
  </div>
}
