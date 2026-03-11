"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Waves } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Ongeldige inloggegevens. Probeer het opnieuw.");
      } else {
        router.push("/");
      }
    } catch {
      setError("Er is een fout opgetreden. Probeer het later opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #1e4d6e 100%)",
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-md border border-white/10">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Waves className="h-8 w-8 text-[#c9a84c]" />
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Paviljoen Partner
            </h1>
          </div>
          <p className="text-sm text-blue-200/70">
            Beheerplatform voor strandpaviljoens
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-blue-100/80"
            >
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="naam@voorbeeld.nl"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-blue-200/40 outline-none transition focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-blue-100/80"
            >
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Voer uw wachtwoord in"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-blue-200/40 outline-none transition focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#c9a84c] px-4 py-2.5 font-semibold text-white shadow-lg transition hover:bg-[#b8963f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Bezig met inloggen..." : "Inloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
