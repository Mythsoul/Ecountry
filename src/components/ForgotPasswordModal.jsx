'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Mail, Key, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '@/helpers/api';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const resetModal = () => {
    setStep(1);
    setEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Step 1: Send reset code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Reset code sent to your email!');
        setStep(2);
      } else {
        setError(data.error || 'Failed to send reset code');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 & 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/forgot-password', {
        email,
        resetCode,
        newPassword
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Password reset successfully!');
        setStep(4);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-xl">
        <CardHeader className="relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center justify-center mb-2">
            {step === 1 && <Mail className="w-8 h-8 text-primary" />}
            {step === 2 && <Key className="w-8 h-8 text-primary" />}
            {step === 3 && <Key className="w-8 h-8 text-primary" />}
            {step === 4 && <CheckCircle className="w-8 h-8 text-green-500" />}
          </div>
          
          <CardTitle className="text-xl text-center">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Enter Reset Code'}
            {step === 3 && 'Enter Reset Code'}
            {step === 4 && 'Success!'}
          </CardTitle>
          
          <CardDescription className="text-center">
            {step === 1 && 'Enter your email to receive a reset code'}
            {step === 2 && 'Check your email for the 6-digit code'}
            {step === 3 && 'Enter the code and your new password'}
            {step === 4 && 'Your password has been reset successfully'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {success}
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Code'
                )}
              </Button>
            </form>
          )}

          {/* Step 2: Code + Password Input */}
          {(step === 2 || step === 3) && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetCode">Reset Code</Label>
                <Input
                  id="resetCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                  maxLength={6}
                  className="bg-background border-border text-center text-lg tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background border-border"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="text-green-600">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Password Reset Complete!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  You can now login with your new password
                </p>
              </div>
            </div>
          )}

          {/* Step indicator */}
          <div className="flex justify-center space-x-2 pt-4">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-2 h-2 rounded-full ${
                  step >= stepNum ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
