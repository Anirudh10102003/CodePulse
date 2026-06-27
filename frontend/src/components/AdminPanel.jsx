import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, NavLink } from 'react-router';
import { Plus, Minus } from 'lucide-react';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(z.object({ input: z.string().min(1), output: z.string().min(1), explanation: z.string().min(1) })).min(1),
  hiddenTestCases: z.array(z.object({ input: z.string().min(1), output: z.string().min(1) })).min(1),
  startCode: z.array(z.object({ language: z.enum(['C++', 'Java', 'JavaScript']), initialCode: z.string().min(1) })).length(3),
  referenceSolution: z.array(z.object({ language: z.enum(['C++', 'Java', 'JavaScript']), completeCode: z.string().min(1) })).length(3),
});

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'Space Mono, monospace', letterSpacing: '0.05em' };

function AdminPanel() {
  const navigate = useNavigate();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [{ language: 'C++', initialCode: '' }, { language: 'Java', initialCode: '' }, { language: 'JavaScript', initialCode: '' }],
      referenceSolution: [{ language: 'C++', completeCode: '' }, { language: 'Java', completeCode: '' }, { language: 'JavaScript', completeCode: '' }],
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestCases' });

  const onSubmit = async (data) => {
    console.log(data)
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) { alert(`Error: ${error.response?.data?.message || error.message}`); }
  };

  const Section = ({ title, children, accent = 'var(--accent-green)' }) => (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '3px', height: '16px', background: accent, borderRadius: '2px' }} />
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>{title}</span>
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <nav className="lc-navbar" style={{ padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="lc-logo">{'CodePulse'}</div>
        <NavLink to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'Space Mono, monospace', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </NavLink>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="animate-in" style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--accent-green)', letterSpacing: '0.15em', marginBottom: '8px' }}></div>
          <h1 className="lc-page-header" style={{ fontSize: '28px' }}>New Problem</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Basic Info */}
          <Section title="BASIC INFORMATION">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>TITLE</label>
                <input {...register('title')} className="lc-input" style={{ padding: '10px 14px' }} placeholder="Two Sum" />
                {errors.title && <span style={{ color: 'var(--accent-red)', fontSize: '11px', fontFamily: 'Space Mono, monospace' }}>{errors.title.message}</span>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea {...register('description')} className="lc-input" style={{ padding: '10px 14px', minHeight: '120px', resize: 'vertical' }} placeholder="Given an array of integers..." />
                {errors.description && <span style={{ color: 'var(--accent-red)', fontSize: '11px', fontFamily: 'Space Mono, monospace' }}>{errors.description.message}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>DIFFICULTY</label>
                  <select {...register('difficulty')} className="lc-select" style={{ padding: '10px 14px' }}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>TAG</label>
                  <select {...register('tags')} className="lc-select" style={{ padding: '10px 14px' }}>
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                  </select>
                </div>
              </div>
            </div>
          </Section>

          {/* Visible Test Cases */}
          <Section title="VISIBLE TEST CASES" accent="var(--accent-blue)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {visibleFields.map((field, index) => (
                <div key={field.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px', position: 'relative' }}>
                  <button type="button" onClick={() => removeVisible(index)}
                    style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: '2px' }}>
                    <Minus size={14} />
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="lc-input" style={{ padding: '8px 12px', fontSize: '13px' }} />
                    <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output" className="lc-input" style={{ padding: '8px 12px', fontSize: '13px' }} />
                    <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" className="lc-input" style={{ padding: '8px 12px', fontSize: '13px', resize: 'vertical', minHeight: '60px' }} />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="lc-btn-ghost" style={{ padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}>
                <Plus size={14} /> Add Visible Case
              </button>
            </div>
          </Section>

          {/* Hidden Test Cases */}
          <Section title="HIDDEN TEST CASES" accent="var(--accent-amber)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {hiddenFields.map((field, index) => (
                <div key={field.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px', position: 'relative' }}>
                  <button type="button" onClick={() => removeHidden(index)}
                    style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: '2px' }}>
                    <Minus size={14} />
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="lc-input" style={{ padding: '8px 12px', fontSize: '13px' }} />
                    <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" className="lc-input" style={{ padding: '8px 12px', fontSize: '13px' }} />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="lc-btn-ghost" style={{ padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}>
                <Plus size={14} /> Add Hidden Case
              </button>
            </div>
          </Section>

          {/* Code Templates */}
          {[0, 1, 2].map((index) => (
            <Section key={index} title={`CODE TEMPLATE — ${['C++', 'JAVA', 'JAVASCRIPT'][index]}`} accent="var(--accent-green)">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>INITIAL CODE</label>
                  <textarea {...register(`startCode.${index}.initialCode`)} className="lc-code" style={{ minHeight: '120px', resize: 'vertical', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: '#0d0d14', width: '100%' }} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>REFERENCE SOLUTION</label>
                  <textarea {...register(`referenceSolution.${index}.completeCode`)} className="lc-code" style={{ minHeight: '120px', resize: 'vertical', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: '#0d0d14', width: '100%' }} />
                </div>
              </div>
            </Section>
          ))}

          <button type="submit" className="lc-btn-primary" style={{ padding: '14px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            Create Problem →
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
