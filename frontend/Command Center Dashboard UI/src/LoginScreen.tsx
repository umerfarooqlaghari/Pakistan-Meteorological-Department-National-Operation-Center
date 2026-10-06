import { useState, type FormEvent } from "react";

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    // Simulate authenticating against PMD NOC identity directory
    setTimeout(() => {
      if (trimmedEmail === "admin@pmd.com" && trimmedPass === "132Pass@!") {
        setIsLoading(false);
        onLogin("admin@pmd.com");
      } else {
        setIsLoading(false);
        setError("Invalid credentials. Please verify your email and passcode.");
      }
    }, 350);
  };

  const handleFillDemo = () => {
    setEmail("admin@pmd.com");
    setPassword("132Pass@!");
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f7f9] text-neutral-900 flex flex-col justify-between font-sans selection:bg-neutral-900 selection:text-white">
      {/* Top Security Banner */}
      <header className="h-10 border-b border-neutral-200 bg-white px-4 md:px-8 flex items-center justify-between text-[11px] text-neutral-600 font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-semibold text-neutral-900">PMDNOC GATEWAY</span>
          <span className="hidden sm:inline text-neutral-300">|</span>
          <span className="hidden sm:inline">GOVERNMENT OF PAKISTAN · MINISTRY OF AVIATION</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-semibold text-neutral-700">
            RESTRICTED ACCESS
          </span>
          <span className="hidden md:inline text-neutral-400">ISB-HQ-SRV-01</span>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white border border-neutral-200 shadow-sm rounded-sm overflow-hidden">
            {/* Header with PMD Badge */}
            <div className="p-6 pb-4 border-b border-neutral-100 bg-gradient-to-b from-neutral-50/70 to-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-neutral-900 bg-neutral-900 text-white font-mono font-bold text-xs flex items-center justify-center relative clip-corner">
                    PMD
                    <i className="absolute bottom-1.5 left-1.5 w-4 h-0.5 bg-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-base font-bold tracking-tight text-neutral-900 leading-tight">
                      PMDNOC Command Center
                    </h1>
                    <p className="text-[11px] text-neutral-500 font-medium">
                      Pakistan Meteorological Department
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Active Feed
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-500">
                <span>National Operations Portal</span>
                <span className="font-mono text-[10px]">SEC-LEVEL 4</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded border border-red-200 bg-red-50/80 p-3 text-xs text-red-800 flex items-start gap-2.5"
                >
                  <svg
                    className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold">Authentication Failed</p>
                    <p className="mt-0.5 text-[11px] text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label
                  htmlFor="pmd-email"
                  className="block text-xs font-semibold text-neutral-700 mb-1 tracking-wide"
                >
                  OPERATOR EMAIL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="pmd-email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@pmd.com"
                    required
                    className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-neutral-300 rounded text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-mono"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="pmd-password"
                    className="block text-xs font-semibold text-neutral-700 tracking-wide"
                  >
                    SECURITY PASSCODE
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono">ENCRYPTED</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <input
                    id="pmd-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full h-10 pl-9 pr-10 text-xs bg-white border border-neutral-300 rounded text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs rounded transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Authenticating Operator...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Command Center</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              {/* Demo Credentials Box */}
              <div className="mt-4 pt-3 border-t border-neutral-100 bg-neutral-50/80 rounded p-3 text-[11px] text-neutral-600">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    Demo Credentials
                  </span>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-[10px] font-semibold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
                <div className="font-mono text-[10px] space-y-0.5 text-neutral-700 bg-white p-2 rounded border border-neutral-200">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">EMAIL:</span>
                    <span className="font-semibold select-all">admin@pmd.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">PASS:</span>
                    <span className="font-semibold select-all">132Pass@!</span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* System Notice */}
          <div className="mt-4 text-center">
            <p className="text-[10px] text-neutral-500 max-w-sm mx-auto leading-relaxed">
              Authorized operations staff only. All console actions, radar feeds, and incident logs are audited in compliance with PMD security protocols.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-8 border-t border-neutral-200 bg-white px-4 md:px-8 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
        <div className="flex items-center gap-3">
          <span>STATUS: ONLINE</span>
          <span className="hidden sm:inline">LATENCY: 4.2ms</span>
          <span className="hidden sm:inline">ISLAMABAD UTC+5</span>
        </div>
        <div>
          <span>PMDNOC v2.4 · CLASSIFIED LEVEL-4</span>
        </div>
      </footer>
    </div>
  );
}
