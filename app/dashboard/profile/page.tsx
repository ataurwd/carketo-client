'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { userService } from '@/services/user.service';
import { uploadService } from '@/services/upload.service';
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
      setProfileMsg({ type: 'success', text: 'প্রোফাইল সফলভাবে আপডেট হয়েছে।' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।' });
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
      setPassMsg({ type: 'success', text: res.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.message || 'পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে।' });
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
          <span>ড্যাশবোর্ডে ফিরে যান</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-black">অ্যাকাউন্ট সেটিংস</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Details Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-black">ব্যক্তিগত প্রোফাইল</h2>
              <p className="text-xs text-zinc-500">আপনার অ্যাকাউন্টের নাম এবং ফোন নম্বর আপডেট করুন।</p>
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
              {/* Avatar Selector */}
              <div className="flex items-center gap-4 pb-2">
                <div className="relative h-16 w-16 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center text-zinc-500 shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 hover:text-black cursor-pointer shadow-sm transition-all">
                    <span>ছবি পরিবর্তন করুন</span>
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const res = await uploadService.uploadFileToR2(file, 'avatars');
                          const updated = await userService.updateProfile({ avatar: res.publicUrl });
                          const token = localStorage.getItem('access_token') || '';
                          setAuth(updated, token);
                          setProfileMsg({ type: 'success', text: 'প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে।' });
                        } catch (err: any) {
                          setProfileMsg({ type: 'error', text: err.message || 'ছবি আপলোড ব্যর্থ হয়েছে।' });
                        }
                      }}
                    />
                  </label>
                  <p className="text-[10px] text-zinc-400 mt-1">JPEG, PNG, WebP (সর্বোচ্চ ২ মেগাবাইট)</p>
                </div>
              </div>

              <Input
                label="পূর্ণ নাম"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                leftIcon={<UserIcon className="w-4 h-4" />}
              />

              <Input
                label="ইমেইল ঠিকানা"
                value={email}
                disabled
                helperText="ইমেইল ঠিকানা সরাসরি পরিবর্তন করা যাবে না।"
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="ফোন নম্বর"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XX-XXXXXX"
                leftIcon={<Phone className="w-4 h-4" />}
              />

              <Button
                type="submit"
                variant="dark"
                size="md"
                isLoading={isUpdatingProfile}
                className="w-full font-bold"
              >
                প্রোফাইল সংরক্ষণ করুন
              </Button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-black">নিরাপত্তা ও পাসওয়ার্ড</h2>
              <p className="text-xs text-zinc-500">একটি শক্তিশালী পাসওয়ার্ড দিয়ে আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন।</p>
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
                label="বর্তমান পাসওয়ার্ড"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Input
                label="নতুন পাসওয়ার্ড"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                helperText="বড় হাতের, ছোট হাতের অক্ষর এবং সংখ্যা থাকতে হবে।"
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Button
                type="submit"
                variant="dark"
                size="md"
                isLoading={isChangingPass}
                className="w-full font-bold"
              >
                পাসওয়ার্ড আপডেট করুন
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
