import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Waves } from 'lucide-react';
import { photos } from '../data/goa';
import { supabase, supabaseConfigured } from '../../lib/supabaseClient';

export default function AuthScreen() {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const submit = async event => {
    event.preventDefault();
    setNotice('');
    setError('');
    if (!supabaseConfigured) {
      setError('Supabase is not configured. Add the Supabase URL and publishable key to the root .env file, then restart Vite.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (authError) throw authError;
        if (!data.session) setNotice('Check your email for a confirmation link. Once confirmed, come back here to sign in.');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
      }
    } catch (authError) {
      setError(authError.message || 'We could not complete that request. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return <main className="auth-page">
    <section className="auth-card" aria-label={mode === 'signin' ? 'Sign in' : 'Create account'}>
      <div className="auth-photo" style={{ backgroundImage: `linear-gradient(180deg,rgba(8,48,62,.05),rgba(8,48,62,.74)),url(${photos.coast})` }}>
        <div className="auth-brand"><span className="brand-mark"><Waves size={19} /></span><span>tide<span className="brand-dot">.</span></span></div>
        <div className="auth-photo-copy"><span className="auth-eyebrow">A SOFTER WAY TO GET AWAY</span><h1>Let the tide<br /><em>take you somewhere.</em></h1><p>Keep your plans, little discoveries, and favorite places together.</p></div>
        <span className="auth-photo-credit">GOA · INDIA</span>
      </div>
      <div className="auth-panel">
        <div className="auth-mobile-brand"><Waves size={21} /> tide<span>.</span></div>
        <div className="auth-panel-head"><span className="auth-kicker">YOUR LITTLE CORNER OF GOA</span><h2>{mode === 'signin' ? 'Welcome back.' : 'A new adventure.'}</h2><p>{mode === 'signin' ? 'Sign in to pick up where you left off.' : 'Create an account to save your plans as you go.'}</p></div>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'signup' && <label className="auth-field"><span>Your name</span><input autoComplete="name" value={name} onChange={event => setName(event.target.value)} placeholder="How should we call you?" required maxLength={100} /></label>}
          <label className="auth-field"><span>Email address</span><input autoComplete="email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
          <label className="auth-field"><span>Password</span><span className="auth-password"><input autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
          {error && <p className="auth-message auth-error" role="alert">{error}</p>}
          {notice && <p className="auth-message auth-success" role="status">{notice}</p>}
          <button className="auth-submit" type="submit" disabled={busy}>{busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account'} <ArrowRight size={17} /></button>
        </form>
        <p className="auth-switch">{mode === 'signin' ? 'New to Tide?' : 'Already have an account?'} <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setNotice(''); }}>{mode === 'signin' ? 'Create an account' : 'Sign in'}</button></p>
        <p className="auth-privacy">Your password is securely handled by Supabase. Tide stores your profile and travel details in your account.</p>
      </div>
    </section>
  </main>;
}
