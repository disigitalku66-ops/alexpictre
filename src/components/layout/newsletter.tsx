"use client";

import { useState } from "react";
import { MailCheck, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Newsletter 1 baris di atas footer (PRD §6.4 seksi 10).
 * MVP: konfirmasi lokal (backend capture = Phase 2a).
 */
export function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Format email belum benar", { description: "Contoh: nama@bisnis.com" });
      return;
    }
    setDone(true);
    toast.success("Email berhasil didaftarkan", {
      description: "Kami hanya mengirim tips dan insight yang relevan, tanpa spam.",
    });
  }

  return (
    <section aria-label="Tips kreatif dan inspirasi bisnis" className="border-t bg-accent/60 dark:bg-accent/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between lg:px-8">
        <div className="max-w-xl">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground sm:text-xl">
            <MailCheck className="h-5 w-5 text-primary" aria-hidden />
            Tips Kreatif untuk Bisnis
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dapatkan tips praktis tentang desain, website, video, dan pemasaran digital yang bisa langsung Anda gunakan.
          </p>
        </div>
        {done ? (
          <p className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Terima kasih. Email Anda sudah terdaftar.
          </p>
        ) : (
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2" role="subscribe">
            <label htmlFor="newsletter-email" className="sr-only">
              Alamat email
            </label>
            <Input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@bisnis.com"
              className="h-11 flex-1 bg-background"
              autoComplete="email"
            />
            <Button type="submit" className="h-11 shrink-0">
              <Send className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Dapatkan Tips</span>
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
