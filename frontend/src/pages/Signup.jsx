import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum 3 characters"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => { dispatch(registerUser(data)); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,135,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,255,135,0.06) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />

      <div className="animate-in" style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="lc-logo" style={{ fontSize: '22px', marginBottom: '8px' }}>{'CodePulse'}</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>Create account</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'Space Mono, monospace' }}>Start solving problems today</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '32px' }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'Space Mono, monospace', marginBottom: '8px', letterSpacing: '0.05em' }}>FIRST NAME</label>
              <input type="text" placeholder="John" className="lc-input" style={{ width: '100%', padding: '12px 14px', fontSize: '14px' }} {...register('firstName')} />
              {errors.firstName && <span style={{ color: 'var(--accent-red)', fontSize: '12px', marginTop: '4px', display: 'block', fontFamily: 'Space Mono, monospace' }}>{errors.firstName.message}</span>}
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'Space Mono, monospace', marginBottom: '8px', letterSpacing: '0.05em' }}>EMAIL</label>
              <input type="email" placeholder="john@example.com" className="lc-input" style={{ width: '100%', padding: '12px 14px', fontSize: '14px' }} {...register('emailId')} />
              {errors.emailId && <span style={{ color: 'var(--accent-red)', fontSize: '12px', marginTop: '4px', display: 'block', fontFamily: 'Space Mono, monospace' }}>{errors.emailId.message}</span>}
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'Space Mono, monospace', marginBottom: '8px', letterSpacing: '0.05em' }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="lc-input" style={{ width: '100%', padding: '12px 44px 12px 14px', fontSize: '14px' }} {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                  {showPassword
                    ? <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              {errors.password && <span style={{ color: 'var(--accent-red)', fontSize: '12px', marginTop: '4px', display: 'block', fontFamily: 'Space Mono, monospace' }}>{errors.password.message}</span>}
            </div>

            <button type="submit" disabled={loading} className="lc-btn-primary" style={{ width: '100%', padding: '13px', fontSize: '13px', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? <><div className="lc-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />Creating account...</> : 'Create Account →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
            Already have an account?{' '}
            <NavLink to="/login" style={{ color: 'var(--accent-green)', textDecoration: 'none', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>Login</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
