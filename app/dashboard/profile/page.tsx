'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { userService } from '@/services/user.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, User as UserIcon, Lock, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UserProfilePage() {
  const { user, setAuth } = useAuthStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    } else {
      userService.getProfile().then((u) => {
        if (u) {
          setName(u.name || '');
          setPhone(u.phone || '');
          setEmail(u.email || '');
        }
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg(null);

    try {
      const updated = await userService.updateProfile({ name, phone });
      const token = localStorage.getItem('access_token') || '';
      setAuth(updated, token);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPass(true);
    setPassMsg(null);

    try {
      const res = await userService.changePassword(currentPassword, newPassword);
      setPassMsg({ type: 'success', text: res.message || 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-black">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Details Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-black">Personal Profile</h2>
              <p className="text-xs text-zinc-500">Update your account name and phone number.</p>
            </div>

            {profileMsg && (
              <div
                className={`flex items-center gap-2 p-3.5 rounded-2xl text-xs font-semibold ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                leftIcon={<UserIcon className="w-4 h-4" />}
              />

              <Input
                label="Email Address"
                value={email}
                disabled
                helperText="Email address cannot be changed directly."
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                leftIcon={<Phone className="w-4 h-4" />}
              />

              <Button
                type="submit"
                variant="dark"
                size="md"
                isLoading={isUpdatingProfile}
                className="w-full font-bold"
              >
                Save Profile
              </Button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-black">Security & Password</h2>
              <p className="text-xs text-zinc-500">Ensure your account is protected with a strong password.</p>
            </div>

            {passMsg && (
              <div
                className={`flex items-center gap-2 p-3.5 rounded-2xl text-xs font-semibold ${
                  passMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {passMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Input
                label="New Password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                helperText="Must include uppercase, lowercase, and numbers."
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Button
                type="submit"
                variant="dark"
                size="md"
                isLoading={isChangingPass}
                className="w-full font-bold"
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
