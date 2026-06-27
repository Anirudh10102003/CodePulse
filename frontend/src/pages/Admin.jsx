import React from 'react';
import { Plus, Edit, Trash2, Video } from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      accent: 'var(--accent-green)',
      accentBg: 'rgba(0,255,135,0.08)',
      accentBorder: 'rgba(0,255,135,0.2)',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      accent: 'var(--accent-amber)',
      accentBg: 'rgba(255,184,0,0.08)',
      accentBorder: 'rgba(255,184,0,0.2)',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      accent: 'var(--accent-red)',
      accentBg: 'rgba(255,69,96,0.08)',
      accentBorder: 'rgba(255,69,96,0.2)',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Solutions',
      description: 'Upload and manage editorial videos',
      icon: Video,
      accent: 'var(--accent-blue)',
      accentBg: 'rgba(0,180,255,0.08)',
      accentBorder: 'rgba(0,180,255,0.2)',
      route: '/admin/video'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Grid bg */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,135,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,0.02) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />

      {/* Navbar */}
      <nav className="lc-navbar" style={{ padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="lc-logo">{'CodePulse'}</div>
        <NavLink to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'Space Mono, monospace', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Problems
        </NavLink>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px', position: 'relative' }}>
        {/* Header */}
        <div className="animate-in" style={{ marginBottom: '60px' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--accent-green)', letterSpacing: '0.15em', marginBottom: '12px' }}></div>
          <h1 className="lc-page-header" style={{ marginBottom: '12px' }}>Manage Platform</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px' }}>Control problems, content, and editorial videos from one place.</p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {adminOptions.map((option, i) => {
            const Icon = option.icon;
            return (
              <NavLink key={option.id} to={option.route} className="admin-action-card animate-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <div style={{ width: '56px', height: '56px', background: option.accentBg, border: `1px solid ${option.accentBorder}`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} color={option.accent} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '6px' }}>{option.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{option.description}</div>
                </div>
                <div style={{ marginTop: '8px', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: option.accent, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Open <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;
