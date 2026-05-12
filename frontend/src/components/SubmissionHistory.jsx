import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { X } from 'lucide-react';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const response = await axiosClient.get(
          `/problem/submittedProblem/${problemId}`
        );

        // console.log(response.data);

        // Safe handling for array/object response
        setSubmissions(
          Array.isArray(response.data)
            ? response.data
            : response.data.submissions || []
        );

        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch submission history');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchSubmissions();
    }
  }, [problemId]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted':
        return {
          color: 'var(--accent-green)',
          bg: 'rgba(0,255,135,0.1)',
          border: 'rgba(0,255,135,0.25)'
        };

      case 'wrong':
        return {
          color: 'var(--accent-red)',
          bg: 'rgba(255,69,96,0.1)',
          border: 'rgba(255,69,96,0.25)'
        };

      case 'error':
        return {
          color: 'var(--accent-amber)',
          bg: 'rgba(255,184,0,0.1)',
          border: 'rgba(255,184,0,0.25)'
        };

      default:
        return {
          color: 'var(--accent-blue)',
          bg: 'rgba(0,180,255,0.1)',
          border: 'rgba(0,180,255,0.25)'
        };
    }
  };

  const formatMemory = (memory) => {
    if (!memory) return '0 kB';

    return memory < 1024
      ? `${memory} kB`
      : `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    return new Date(dateString).toLocaleString();
  };

  // Loading UI
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          height: '100%'
        }}
      >
        <div className="lc-spinner" />
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <div
          style={{
            background: 'rgba(255,69,96,0.1)',
            border: '1px solid rgba(255,69,96,0.25)',
            borderRadius: '10px',
            padding: '16px',
            color: 'var(--accent-red)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '13px'
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  // Empty UI
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>
          📭
        </div>

        <div
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}
        >
          No submissions yet
        </div>

        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: '4px'
          }}
        >
          Submit your first solution to see history
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <div
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginBottom: '16px',
          letterSpacing: '0.1em'
        }}
      >
        {submissions.length} SUBMISSION
        {submissions.length !== 1 ? 'S' : ''}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        {Array.isArray(submissions) &&
          submissions.map((sub, index) => {
            const st = getStatusStyle(sub.status);

            return (
              <div
                key={sub._id || index}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <span
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    minWidth: '20px'
                  }}
                >
                  {index + 1}
                </span>

                <span
                  style={{
                    background: st.bg,
                    border: `1px solid ${st.border}`,
                    color: st.color,
                    borderRadius: '5px',
                    padding: '3px 10px',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    minWidth: '80px',
                    textAlign: 'center'
                  }}
                >
                  {sub.status
                    ? sub.status.charAt(0).toUpperCase() +
                      sub.status.slice(1)
                    : 'Unknown'}
                </span>

                <span
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '12px',
                    color: 'var(--accent-blue)',
                    background: 'rgba(0,180,255,0.1)',
                    border: '1px solid rgba(0,180,255,0.2)',
                    borderRadius: '4px',
                    padding: '2px 8px'
                  }}
                >
                  {sub.language || 'N/A'}
                </span>

                <span
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    color: 'var(--text-muted)'
                  }}
                >
                  {sub.runtime || 0}s
                </span>

                <span
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    color: 'var(--text-muted)'
                  }}
                >
                  {formatMemory(sub.memory)}
                </span>

                <span
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    color: 'var(--text-muted)'
                  }}
                >
                  {sub.testCasesPassed || 0}/
                  {sub.testCasesTotal || 0} tests
                </span>

                <span
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    marginLeft: 'auto'
                  }}
                >
                  {formatDate(sub.createdAt)}
                </span>

                <button
                  onClick={() => setSelectedSubmission(sub)}
                  className="lc-btn-ghost"
                  style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  View Code
                </button>
              </div>
            );
          })}
      </div>

      {/* Modal */}
      {selectedSubmission && (
        <div
          className="lc-modal-overlay"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="lc-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '16px',
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}
                >
                  Submission Code
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <pre
              className="lc-code"
              style={{ maxHeight: '400px' }}
            >
              <code>
                {selectedSubmission.code || 'No code available'}
              </code>
            </pre>

            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <button
                onClick={() => setSelectedSubmission(null)}
                className="lc-btn-ghost"
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;