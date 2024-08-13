import data from "@/data/footer.json";
const { links, portfolio_source_code } = data;

export const Footer = () => (
  <>
    <footer className="site-footer">
      <div className="site-footer__portfolio-details">
        <span className="site-footer__description">Made with Next, Gsap, SASS - </span>
        <a href={portfolio_source_code}>
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
);