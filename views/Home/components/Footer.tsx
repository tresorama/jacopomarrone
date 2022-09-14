import { links, portfolio_permalink } from "../assets/social-links"

export const Footer = () => {
  return (
    <>
      <footer className="site-footer">
        <div className="site-footer__portfolio-details">
          <span className="site-footer__description">Made with Pug, SASS, ES6 - </span>
          <a href={portfolio_permalink}>
            <span className="site-footer__link site-footer__source-code-link">Source Code</span>
          </a>
        </div>
        <ul className="site-footer__links-list">
          {links.map(link => (
            <li key={link.label} className="site-footer__link">
              <a href={link.permalink}>{link.label}</a>
            </li>
          ))}
        </ul>
      </footer>
    </>
  )

}