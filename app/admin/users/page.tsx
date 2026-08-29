'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  Ban,
  Search,
  Key,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-black">User Directory & RBAC</h1>
            <span className="h-6 px-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
              {users.length} Accounts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage user accounts, assign Administrator privileges, and enforce security policies.
          </p>
        </div>
      </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
            >
              <option value="all">All Roles</option>
              <option value="user">Regular Users</option>
              <option value="admin">Super Admins</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
            >
              <option value="all">All Account Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        {isLoading ? (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-zinc-500">Loading user directory...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="py-4 px-6">User Profile</th>
                    <th className="py-4 px-6">Contact Email & Phone</th>
                    <th className="py-4 px-6">Assigned Role</th>
                    <th className="py-4 px-6">Account Status</th>
                    <th className="py-4 px-6 text-right">RBAC Role Switch</th>
                    <th className="py-4 px-6 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center font-black text-sm">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-extrabold text-black text-sm">{u.name}</p>
                            <p className="text-[11px] text-zinc-400">
                              Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <p className="text-zinc-900 font-bold">{u.email}</p>
                        <p className="text-[11px] text-zinc-400">{u.phone || 'No phone'}</p>
                      </td>

                      <td className="py-4 px-6">
                        <Badge
                          variant={u.role === 'admin' ? 'brand' : 'dark'}
                          size="sm"
                        >
                          {u.role?.toUpperCase()}
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

                      <td className="py-4 px-6 text-right">
                        {u.role === 'admin' ? (
                          <button
                            type="button"
                            onClick={() => handleRoleChange(u._id, 'user')}
                            className="px-2.5 py-1 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-[11px] font-bold transition-colors"
                            title="Demote to Regular User"
                          >
                            Demote to User
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRoleChange(u._id, 'admin')}
                            className="px-2.5 py-1 rounded-xl bg-black text-white hover:bg-zinc-800 text-[11px] font-bold transition-colors"
                            title="Promote to Super Admin"
                          >
                            Make Admin
                          </button>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
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
        ) : (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <Users className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">No Users Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No registered user accounts matched your search criteria.
            </p>
          </div>
        )}
    </div>
  );
}
