import { useParams } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router';
import { Upload, CheckCircle } from 'lucide-react';

function AdminUpload() {
  const { problemId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const { register, handleSubmit, watch, formState: { errors }, reset, setError, clearErrors } = useForm();
  const selectedFile = watch('videoFile')?.[0];

  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    setUploading(true); setUploadProgress(0); clearErrors();
    try {
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;
      const formData = new FormData();
      formData.append('file', file); formData.append('signature', signature);
      formData.append('timestamp', timestamp); formData.append('public_id', public_id);
      formData.append('api_key', api_key);
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      });
      const cloudinaryResult = uploadResponse.data;
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId, cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url, duration: cloudinaryResult.duration,
      });
      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
    } catch (err) {
      setError('root', { type: 'manual', message: err.response?.data?.message || 'Upload failed.' });
    } finally { setUploading(false); setUploadProgress(0); }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60), secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <nav className="lc-navbar" style={{ padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="lc-logo">{'<LC />'}</div>
        <NavLink to="/admin/video" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'Space Mono, monospace', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </NavLink>
      </nav>

      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 24px' }}>
        <div className="animate-in" style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--accent-blue)', letterSpacing: '0.15em', marginBottom: '8px' }}>// VIDEO UPLOAD</div>
          <h1 className="lc-page-header" style={{ fontSize: '28px' }}>Upload Editorial</h1>
        </div>

        <div className="animate-in delay-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '32px' }}>
          {uploadedVideo ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle size={48} color="var(--accent-green)" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Upload Successful!</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
                Duration: {formatDuration(uploadedVideo.duration)}<br />
                Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}
              </div>
              <button onClick={() => setUploadedVideo(null)} className="lc-btn-ghost" style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>Upload Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Drop zone */}
              <div style={{ border: `2px dashed ${errors.videoFile ? 'var(--accent-red)' : 'var(--border-subtle)'}`, borderRadius: '10px', padding: '32px 20px', textAlign: 'center', transition: 'border-color 0.2s', background: 'var(--bg-elevated)', position: 'relative' }}>
                <Upload size={28} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Choose a video file</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-muted)' }}>Max 100MB · Any video format</div>
                <input type="file" accept="video/*"
                  {...register('videoFile', {
                    required: 'Please select a video file',
                    validate: {
                      isVideo: (files) => { if (!files?.[0]) return 'Select a file'; return files[0].type.startsWith('video/') || 'Invalid video file'; },
                      fileSize: (files) => { if (!files?.[0]) return true; return files[0].size <= 100 * 1024 * 1024 || 'File must be under 100MB'; }
                    }
                  })}
                  disabled={uploading}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
              </div>
              {errors.videoFile && <span style={{ color: 'var(--accent-red)', fontSize: '12px', fontFamily: 'Space Mono, monospace', marginTop: '-12px' }}>{errors.videoFile.message}</span>}

              {selectedFile && (
                <div style={{ background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: '8px', padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--accent-blue)', marginBottom: '2px' }}>Selected:</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{selectedFile.name}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{formatFileSize(selectedFile.size)}</div>
                </div>
              )}

              {uploading && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span>Uploading to Cloudinary...</span>
                    <span style={{ color: 'var(--accent-green)' }}>{uploadProgress}%</span>
                  </div>
                  <div className="lc-progress-bg">
                    <div className="lc-progress-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {errors.root && (
                <div style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', borderRadius: '8px', padding: '12px 16px', color: 'var(--accent-red)', fontSize: '13px', fontFamily: 'Space Mono, monospace' }}>{errors.root.message}</div>
              )}

              <button type="submit" disabled={uploading} className="lc-btn-primary" style={{ padding: '13px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                {uploading ? <><div className="lc-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />Uploading...</> : <><Upload size={15} />Upload Video</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;
