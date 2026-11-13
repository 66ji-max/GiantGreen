import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseClientConfigured } from '../lib/supabaseClient';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverDbReady, setServerDbReady] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    async function checkEnvironmentAndSession() {
      try {
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          if (active) {
            setServerDbReady(Boolean(healthData.databaseConfigured));
          }
        }
      } catch {
        // Ignore transient health check failure
      }

      if (!supabase) {
        if (active) setIsCheckingSession(false);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token) {
          const meRes = await fetch('/api/admin/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (meRes.ok) {
            if (active) navigate('/admin', { replace: true });
            return;
          }
        }
      } catch {
        // Not signed in
      } finally {
        if (active) setIsCheckingSession(false);
      }
    }

    checkEnvironmentAndSession();
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    if (!supabase || !isSupabaseClientConfigured) {
      setError(
        'Supabase Authentication is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setError('Please enter both your administrator email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !data.session) {
        throw new Error(authError?.message || 'Invalid login credentials.');
      }

      // Verify on backend that this authenticated user is an authorized GiantGreen administrator
      const verifyRes = await fetch('/api/admin/me', {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

      const verifyBody = await verifyRes.json().catch(() => null);

      if (!verifyRes.ok) {
        // Immediately revoke browser session if account is not authorized
        await supabase.auth.signOut();
        throw new Error(
          verifyBody?.error ||
            'Your account is not authorized to access the GiantGreen Admin Portal.'
        );
      }

      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory flex flex-col justify-between px-6 py-12 text-charcoal">
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to GiantGreen Website</span>
          </Link>
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-warm-bronze mb-2">
            GiantGreen EcoTech
          </p>
          <h1 className="text-3xl md:text-4xl font-serif text-espresso-brown">
            Administrator Sign In
          </h1>
          <p className="text-sm text-charcoal/65 mt-2">
            Authorized personnel only. Public registration is disabled.
          </p>
        </div>

        <div className="bg-white border border-soft-sand/40 shadow-sm rounded-sm p-8">
          {(!isSupabaseClientConfigured || serverDbReady === false) && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-900 space-y-2">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Supabase Setup Required</span>
              </p>
              <p className="leading-relaxed">
                This portal requires Supabase credentials before administrator login can operate:
              </p>
              <ul className="list-disc pl-4 space-y-1 font-mono text-[11px]">
                {!isSupabaseClientConfigured && (
                  <>
                    <li>VITE_SUPABASE_URL</li>
                    <li>VITE_SUPABASE_ANON_KEY</li>
                  </>
                )}
                {serverDbReady === false && (
                  <>
                    <li>SUPABASE_URL</li>
                    <li>SUPABASE_SERVICE_ROLE_KEY</li>
                  </>
                )}
              </ul>
            </div>
          )}

          {isCheckingSession ? (
            <div className="py-12 text-center text-sm text-charcoal/60 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-soft-sand border-t-charcoal rounded-full animate-spin" />
              <span>Verifying session...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-sm text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="admin-email" className="block text-xs font-semibold uppercase tracking-wider text-charcoal/80 mb-1.5">
                  Administrator Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="giantgreenecotech@ggetapp.com"
                  className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-wider text-charcoal/80 mb-1.5">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isSupabaseClientConfigured}
                className="w-full bg-charcoal text-white py-3.5 rounded-full font-semibold text-sm hover:bg-espresso-brown transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-charcoal/50">
          <ShieldCheck className="w-4 h-4 text-eco-green" />
          <span>Protected by Supabase Auth &amp; Server-Side Verification</span>
        </div>
      </div>
    </div>
  );
}
