export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-logo">Builders</span>
          <span className="footer-tagline">Lo que construyes vale más que tu currículum.</span>
        </div>
        <div className="footer-right">
          <a
            href="https://linkedin.com/in/[URL_LINKEDIN]"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LinkedIn
          </a>
          <span className="footer-meta">Construido con Claude Code · 2026</span>
        </div>
      </div>
    </footer>
  )
}
