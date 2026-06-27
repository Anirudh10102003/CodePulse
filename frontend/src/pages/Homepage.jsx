import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({ difficulty: 'all', tag: 'all', status: 'all' });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) { console.error('Error fetching problems:', error); }
    };
    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) { console.error('Error fetching solved problems:', error); }
    };
    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => { dispatch(logoutUser()); setSolvedProblems([]); setDropdownOpen(false); };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  const difficultyBadge = (d) => {
    const lower = d.toLowerCase();
    if (lower === 'easy') return <span className="diff-easy">{d}</span>;
    if (lower === 'medium') return <span className="diff-medium">{d}</span>;
    return <span className="diff-hard">{d}</span>;
  };

  const stats = {
    total: problems.length,
    solved: solvedProblems.length,
    easy: problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length,
    medium: problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length,
    hard: problems.filter(p => p.difficulty?.toLowerCase() === 'hard').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav className="lc-navbar" style={{ padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="lc-logo">{'CodePulse'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Stats strip */}
          <div style={{ display: 'flex', gap: '20px', marginRight: '8px' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{stats.solved}</span>/{stats.total} solved
            </span>
          </div>
          {/* User menu */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 14px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-green), #00b4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#000' }}>
                {user?.firstName?.[0]?.toUpperCase()}
              </div>
              {user?.firstName}
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', minWidth: '160px', overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                {user?.role === 'admin' && (
                  <NavLink to="/admin" onClick={() => setDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', color: 'var(--accent-green)', textDecoration: 'none', fontSize: '13px', fontFamily: 'Space Mono, monospace', borderBottom: '1px solid var(--border-subtle)' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="12" cy="12" r="3" /></svg>
                    Admin Panel
                  </NavLink>
                )}
                <button onClick={handleLogout}
                  style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontFamily: 'Space Mono, monospace', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }} className="animate-in">
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '20px', color: 'var(--accent-green)', letterSpacing: '0.15em', marginBottom: '8px' }}>PROBLEMS</div>
          <h1 className="lc-page-header" style={{ marginBottom: '8px' }}>Solve. Learn. Grow.</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{filteredProblems.length} problems available</p>
        </div>

        {/* Stats cards */}
        <div className="animate-in delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: 'Total', val: stats.total, color: 'var(--text-primary)' },
            { label: 'Easy', val: stats.easy, color: 'var(--accent-green)' },
            { label: 'Medium', val: stats.medium, color: 'var(--accent-amber)' },
            { label: 'Hard', val: stats.hard, color: 'var(--accent-red)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: s.color, fontFamily: 'Space Mono, monospace' }}>{s.val}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="animate-in delay-2" style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { key: 'status', options: [['all','All Problems'],['solved','Solved']] },
            { key: 'difficulty', options: [['all','All Levels'],['easy','Easy'],['medium','Medium'],['hard','Hard']] },
            { key: 'tag', options: [['all','All Tags'],['array','Array'],['linkedList','Linked List'],['graph','Graph'],['dp','DP'],['stack','Stack']] },
          ].map(f => (
            <select key={f.key} className="lc-select" style={{ padding: '8px 12px' }}
              value={filters[f.key]} onChange={e => setFilters({...filters, [f.key]: e.target.value})}>
              {f.options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
        </div>

        {/* Problems list */}
        <div className="animate-in delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredProblems.map((problem, i) => {
            const isSolved = solvedProblems.some(sp => sp._id === problem._id);
            return (
              <NavLink key={problem._id} to={`/problem/${problem._id}`} style={{ textDecoration: 'none' }}>
                <div className="lc-card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', animationDelay: `${i * 0.03}s` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text-muted)', minWidth: '28px' }}>#{i + 1}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{problem.title}</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {difficultyBadge(problem.difficulty)}
                        <span className="lc-tag">{problem.tags}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isSolved && (
                      <span className="lc-solved">
                        <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Solved
                      </span>
                    )}
                    <svg width="16" height="16" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </NavLink>
            );
          })}
          {filteredProblems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', fontSize: '13px' }}>
              No problems match your filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
