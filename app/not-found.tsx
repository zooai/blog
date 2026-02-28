"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center w-full">
      <div className="text-center flex flex-col gap-4 max-w-xs mx-auto">
        <h1 className="text-8xl font-mono font-bold text-primary">404</h1>
        <p className="text-muted-foreground text-base leading-relaxed text-center tracking-tight text-balance">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Button asChild className="w-full rounded-lg h-9">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
