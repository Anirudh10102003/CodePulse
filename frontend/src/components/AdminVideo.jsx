import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router';
import { Upload, Trash2 } from 'lucide-react';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchProblems(); }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) { setError('Failed to fetch problems'); console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      setProblems(problems.filter(p => p._id !== id));
    } catch (err) { setError(err); console.log(err); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="lc-spinner" />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', borderRadius: '10px', padding: '20px 28px', color: 'var(--accent-red)', fontFamily: 'Space Mono, monospace', fontSize: '14px' }}>
        {typeof error === 'string' ? error : error?.response?.data?.error || 'An error occurred'}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <nav className="lc-navbar" style={{ padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="lc-logo">{'<LC />'}</div>
        <NavLink to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'Space Mono, monospace', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </NavLink>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="animate-in" style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--accent-blue)', letterSpacing: '0.15em', marginBottom: '8px' }}>// VIDEO SOLUTIONS</div>
          <h1 className="lc-page-header">Upload & Manage Videos</h1>
        </div>

        <div className="animate-in delay-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
          <table className="lc-table">
            <thead>
              <tr>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Difficulty</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Tag</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Upload</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Delete Video</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr key={problem._id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '16px 20px', fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text-muted)' }}>{index + 1}</td>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>{problem.title}</td>
                  <td style={{ padding: '16px 20px' }}>
                    {problem.difficulty?.toLowerCase() === 'easy' && <span className="diff-easy">{problem.difficulty}</span>}
                    {problem.difficulty?.toLowerCase() === 'medium' && <span className="diff-medium">{problem.difficulty}</span>}
                    {problem.difficulty?.toLowerCase() === 'hard' && <span className="diff-hard">{problem.difficulty}</span>}
                  </td>
                  <td style={{ padding: '16px 20px' }}><span className="lc-tag">{problem.tags}</span></td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <NavLink to={`/admin/upload/${problem._id}`}
                      style={{ background: 'rgba(0,180,255,0.12)', border: '1px solid rgba(0,180,255,0.25)', color: 'var(--accent-blue)', borderRadius: '8px', padding: '8px 14px', textDecoration: 'none', fontFamily: 'Space Mono, monospace', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={13} /> Upload
                    </NavLink>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <button onClick={() => handleDelete(problem._id)} className="lc-btn-danger" style={{ padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminVideo;
