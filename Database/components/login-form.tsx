"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login() {
    setError("");
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      router.push("/dashboard");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(loginError.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="w-full max-w-md rounded-md border border-white/10 bg-navy-900 p-8 shadow-broadcast">
      <div className="mb-8 flex items-center gap-3">
        <Image src="/brand/cmedia-logo-white.png" alt="CMedia Productions" width={160} height={48} className="h-12 w-auto" priority />
        <div>
          <h1 className="text-2xl font-black text-white">Inloggen</h1>
        </div>
      </div>
      <label className="mb-4 block text-sm font-semibold text-slate-300">
        E-mail
        <Input className="mt-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="naam@cmedia.nl" />
      </label>
      <label className="mb-6 block text-sm font-semibold text-slate-300">
        Wachtwoord
        <Input className="mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      {error && <p className="mb-4 rounded-md bg-red-500/[0.15] p-3 text-sm text-red-100">{error}</p>}
      <Button className="w-full" type="button" onClick={login}>Log in</Button>
    </form>
  );
}
