'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal({ onNotify }) {
  const { authModalOpen, authModalTab, setAuthModalTab, closeAuthModal, login, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens or tab changes
  useEffect(() => {
    if (authModalOpen) {
      setError('');
      setName('');
      setEmail('');
      setPassword('');
    }
  }, [authModalOpen, authModalTab]);

  if (!authModalOpen) return null;

  const isLogin = authModalTab === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        if (onNotify) onNotify('Welcome back! Signed in successfully.', 'success');
      } else {
        await register(name.trim(), email, password);
        if (onNotify) onNotify('Account created successfully! Welcome to Mini Canvas.', 'success');
      }
      closeAuthModal();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div
        className="modal-card"
        style={{ maxWidth: '440px', width: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 10px var(--accent-glow)',
              }}
            >
              {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <div className="modal-title" style={{ fontSize: '17px', lineHeight: '1.2' }}>
                {isLogin ? 'Sign In to Mini Canvas' : 'Create an Account'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isLogin
                  ? 'Access your cloud canvases and private designs'
                  : 'Sync designs, manage layers, and collaborate'}
              </div>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="btn-3d btn-3d-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="auth-tab-bar">
          <button
            type="button"
            className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setAuthModalTab('login')}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setAuthModalTab('register')}
          >
            <UserPlus size={14} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
          {error && (
            <div className="auth-error-banner">
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="prop-label" style={{ display: 'block', marginBottom: '6px' }}>
                Your Name
              </label>
              <div className="auth-input-group">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  className="input-3d auth-input"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  autoFocus={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="prop-label" style={{ display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div className="auth-input-group">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                className="input-3d auth-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus={isLogin}
              />
            </div>
          </div>

          <div>
            <label className="prop-label" style={{ display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div className="auth-input-group">
              <Lock size={16} className="auth-input-icon" />
              <input
                type="password"
                className="input-3d auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {!isLogin && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Must be at least 6 characters long
              </span>
            )}
          </div>

          {/* Secure Cloud Badge */}
          <div className="auth-secure-badge">
            <ShieldCheck size={16} color="var(--accent-emerald)" />
            <span>Secure JWT authentication with MongoDB persistence</span>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn-3d btn-3d-secondary"
              style={{ flex: 1 }}
              onClick={closeAuthModal}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-3d btn-3d-primary"
              style={{ flex: 2 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="status-dot saving" size={16} color="#fff" />
                  <span>{isLogin ? 'Signing in...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  {isLogin ? <LogIn size={15} /> : <Sparkles size={15} />}
                  <span>{isLogin ? 'Sign In' : 'Get Started Free'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Modal Footer Switch Link */}
        <div className="modal-footer" style={{ justifyContent: 'center', background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account yet?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setAuthModalTab(isLogin ? 'register' : 'login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0 4px',
                textDecoration: 'underline',
              }}
            >
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
