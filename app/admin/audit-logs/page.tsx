'use client';

import React, { useEffect, useState } from 'react';
import { adminService, IAuditLogAdmin } from '@/services/admin.service';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/common/Pagination';
import {
  ScrollText,
  Search,
  ShieldCheck,
  Clock,
  User,
  Database,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<IAuditLogAdmin[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchLogs();
  }, []);

  // Reset to first page on search or filter change
  useEffect(() => {
    setPage(1);
  }, [search, actionFilter, pageSize]);

  const fetchLogs = () => {
    setIsLoading(true);
    adminService
      .getAuditLogs({ limit: 200 })
      .then((res) => setLogs(res || []))
      .catch((err) => console.error('Failed to load audit logs:', err))
      .finally(() => setIsLoading(false));
  };

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'all' && !log.action?.toLowerCase().includes(actionFilter.toLowerCase())) {
      return false;
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchActor = log.userId?.name?.toLowerCase().includes(q) || log.userId?.email?.toLowerCase().includes(q);
    const matchAction = log.action?.toLowerCase().includes(q);
    const matchEntity = log.entity?.toLowerCase().includes(q);
    return matchActor || matchAction || matchEntity;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  const getActionColor = (action: string) => {
    if (action.includes('DELETE') || action.includes('REVOKE') || action.includes('BAN')) {
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    }
    if (action.includes('CREATE') || action.includes('APPROVE') || action.includes('FEATURE')) {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">System Security & Audit Trail</h1>
            <span className="h-6 px-2.5 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
              {logs.length} Events
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Immutable log of administrative operations, security mutations, and platform state changes.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action type, or entity name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Actions</option>
            <option value="create">Create Operations</option>
            <option value="update">Update Operations</option>
            <option value="delete">Delete Operations</option>
            <option value="status">Status Mutations</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-300 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-zinc-400">
            <div className="h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading system audit trail...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ScrollText className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-400">No security audit events recorded.</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/70 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                    <th className="py-3.5 px-4 sm:px-6">Timestamp</th>
                    <th className="py-3.5 px-4">Admin Actor</th>
                    <th className="py-3.5 px-4">Action Type</th>
                    <th className="py-3.5 px-4">Target Entity</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-xs font-medium">
                  {paginatedLogs.map((log) => {
                    const isExpanded = expandedId === log._id;
                    return (
                      <React.Fragment key={log._id}>
                        <tr className="hover:bg-zinc-800/40 transition-colors">
                          {/* Timestamp */}
                          <td className="py-4 px-4 sm:px-6 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>

                          {/* Actor */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-zinc-700">
                                {log.userId?.name ? log.userId.name.charAt(0).toUpperCase() : 'A'}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-white truncate">{log.userId?.name || 'Administrator'}</p>
                                <p className="text-[10px] text-zinc-400 truncate">{log.userId?.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Action Badge */}
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getActionColor(
                                log.action
                              )}`}
                            >
                              {log.action}
                            </span>
                          </td>

                          {/* Entity */}
                          <td className="py-4 px-4">
                            <p className="font-bold text-zinc-200">{log.entity}</p>
                            {log.entityId && (
                              <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[120px]">
                                {log.entityId}
                              </p>
                            )}
                          </td>

                          {/* Expand Details */}
                          <td className="py-4 px-4 text-right">
                            {log.details ? (
                              <button
                                onClick={() => setExpandedId(isExpanded ? null : log._id)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                              >
                                <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            ) : (
                              <span className="text-zinc-600 italic text-[11px]">None</span>
                            )}
                          </td>
                        </tr>

                        {/* Expandable JSON payload drawer */}
                        {isExpanded && log.details && (
                          <tr className="bg-zinc-950/80">
                            <td colSpan={5} className="p-4 sm:px-6">
                              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5 font-mono text-[11px] text-zinc-300">
                                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-sans">
                                  Event Payload & Mutation Diff
                                </p>
                                <pre className="overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-2">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={filteredLogs.length}
                limit={pageSize}
                onPageChange={setPage}
                variant="dark"
                itemLabel="audit events"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
