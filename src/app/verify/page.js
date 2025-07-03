'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage('Email verified successfully! You can now login.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      })
      .catch(error => {
        setStatus('error');
        setMessage('An error occurred during verification');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verification
          </h1>
          
          {status === 'verifying' && (
            <div className="text-blue-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Verifying your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-green-600">
              <div className="text-4xl mb-4">✅</div>
              <p className="mb-4">{message}</p>
              <a
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </a>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-red-600">
              <div className="text-4xl mb-4">❌</div>
              <p className="mb-4">{message}</p>
              <a
                href="/signup"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Back to Signup
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
