import { MessageCircle } from "lucide-react";

export function SiteNav() {
  return (
    <header className="border-b border-border/50 px-6 py-4 sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <a
          href="https://zoo.ngo"
          className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
        >
          <span className="font-semibold text-base tracking-tight">zoo</span>
          <span className="text-muted-foreground text-sm">/ blog</span>
        </a>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <a
            href="https://zoo.ngo"
            className="hover:text-foreground transition-colors"
          >
            zoo.ngo
          </a>
          <a
            href="https://zips.zoo.ngo"
            className="hover:text-foreground transition-colors hidden sm:block"
          >
            ZIPs
          </a>
          <a
            href="https://discord.gg/zooai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-foreground hover:bg-accent transition-all text-sm font-medium"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Discord
          </a>
        </nav>
      </div>
    </header>
  );
}
