export default function Footer() {
  return (
    <footer className="border-t border-border/50 px-6 py-6 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>© 2025 Zoo Labs Foundation Inc. 501(c)(3) Non-Profit.</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://zoo.ngo/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </a>
          <a
            href="https://zoo.ngo/terms"
            className="hover:text-foreground transition-colors"
          >
            Terms
          </a>
          <a
            href="https://zoo.ngo/contact"
            className="hover:text-foreground transition-colors"
          >
            Contact
          </a>
          <a
            href="https://github.com/zooai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://zoo.ngo/donate"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors font-medium"
          >
            Donate
          </a>
        </div>
      </div>
    </footer>
  );
}
