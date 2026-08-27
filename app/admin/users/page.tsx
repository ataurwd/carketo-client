'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Users, ShieldAlert, CheckCircle, Ban, Search } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService
      .getUsers()
      .then((res) => setUsers(res))
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await adminService.updateUserStatus(userId, newStatus);
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
    } catch {
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Super Admin</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-black">User Directory</h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Inspect accounts, assign role permissions, and moderate user access.
              </p>
            </div>

            <div className="w-full sm:w-72">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search user or email..."
                  className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">System Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-bold text-black">{u.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-zinc-600">{u.email}</td>

                    <td className="py-4 px-6">
                      <Badge
                        variant={u.role === 'admin' ? 'brand' : u.role === 'provider' ? 'dark' : 'slate'}
                        size="sm"
                      >
                        {u.role}
                      </Badge>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : u.status === 'suspended'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.status === 'active'
                              ? 'bg-emerald-500'
                              : u.status === 'suspended'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {u.status || 'active'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      {u.status !== 'active' ? (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(u._id, 'active')}
                          className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition-colors"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(u._id, 'suspended')}
                          className="px-3 py-1 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
