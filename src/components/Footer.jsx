export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-logo">Builders</span>
          <span className="footer-sep">·</span>
          <span className="footer-tagline">El portfolio de los builders</span>
        </div>
        <a
          href="https://linkedin.com/company/builders-es"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-linkedin"
          aria-label="LinkedIn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
      </div>
    </footer>
  )
}
