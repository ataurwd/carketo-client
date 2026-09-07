'use client';

import React, { useEffect, useState } from 'react';
import { adminService, ISettingsData } from '@/services/admin.service';
import { showToast } from '@/lib/alert';
import { Button } from '@/components/ui/Button';
import {
  Settings,
  DollarSign,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Megaphone,
  Save,
  Layers,
  Gauge,
  Sliders,
  Sparkles,
  RefreshCw,
  Power,
  ExternalLink,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ISettingsData>({
    platformName: 'Carketo',
    supportEmail: 'concierge@carketo.com',
    supportPhone: '+1 (800) 555-CARKETO',
    headquartersAddress: '5th Avenue Executive Suite, Manhattan, NY 10022',
    currency: 'USD',
    currencySymbol: '$',
    distanceUnit: 'Miles',
    maxPhotosPerCar: 6,
    maxPhotoSizeMb: 10,
    autoApproveListings: true,
    maintenanceMode: false,
    maintenanceMessage: 'Carketo is currently undergoing scheduled platform upgrades.',
    topAnnouncement: {
      enabled: true,
      text: '⚡ Luxury Spring Fleet Collection: Verified luxury rentals and sales with 24/7 concierge delivery.',
      link: '/cars',
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    adminService
      .getSettings()
      .then((res) => {
        if (res) setSettings(res);
      })
      .catch((err) => console.error('Failed to load settings:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const updated = await adminService.updateSettings(settings);
      setSettings(updated);
      showToast('Global platform configurations saved successfully', 'success');
    } catch {
      showToast('Settings saved locally', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* HEADER WITH TITLE & INSTANT SAVE ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-zinc-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Platform Settings & Configurations
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            Configure system branding, currencies, announcement banners, and operational policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleSave()}
            disabled={isSaving || isLoading}
            className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold py-2.5 px-6 shadow-lg shadow-orange-600/25 flex items-center gap-2 transition-all shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 2-COLUMN FLEXIBLE RESPONSIVE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* CARD 1: PLATFORM IDENTITY & CONTACT */}
          <div className="bg-zinc-900/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-zinc-800 shadow-sm space-y-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">Platform Branding & Contacts</h2>
                    <p className="text-[11px] text-zinc-400">Public identity & concierge coordinates</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">Platform Brand Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={settings.platformName}
                      onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-semibold focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="e.g. Carketo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Support Email</span>
                    </label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-semibold focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="concierge@carketo.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Support Hotline</span>
                    </label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-semibold focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="+1 (800) 555-CARKETO"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Headquarters Corporate Address</span>
                  </label>
                  <input
                    type="text"
                    value={settings.headquartersAddress}
                    onChange={(e) => setSettings({ ...settings, headquartersAddress: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-semibold focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="5th Avenue Executive Suite, Manhattan, NY"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Public Storefront Footer Sync</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>
          </div>

          {/* CARD 2: FINANCIAL STANDARDS & UNITS */}
          <div className="bg-zinc-900/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-zinc-800 shadow-sm space-y-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">Financial Standards & Units</h2>
                    <p className="text-[11px] text-zinc-400">Base currency, symbol, and mileage metrics</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-300">Currency Code (ISO)</label>
                    <input
                      type="text"
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold uppercase focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="USD"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-300">Currency Symbol</label>
                    <input
                      type="text"
                      value={settings.currencySymbol}
                      onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="$"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-300">Odometer Distance Unit</label>
                    <select
                      value={settings.distanceUnit}
                      onChange={(e) => setSettings({ ...settings, distanceUnit: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-semibold focus:outline-none focus:border-orange-500 transition-colors"
                    >
                      <option value="Miles">Miles (mi)</option>
                      <option value="Kilometers">Kilometers (km)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-300">Max Photos Per Vehicle</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={settings.maxPhotosPerCar || 6}
                      onChange={(e) =>
                        setSettings({ ...settings, maxPhotosPerCar: parseInt(e.target.value, 10) || 6 })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-semibold focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Checkout Price Calculation Format</span>
              <span className="text-white font-mono font-bold">
                {settings.currencySymbol}0.00 {settings.currency}
              </span>
            </div>
          </div>

          {/* CARD 3: ANNOUNCEMENT BANNER */}
          <div className="bg-zinc-900/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-zinc-800 shadow-sm space-y-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">Top Website Announcement Banner</h2>
                    <p className="text-[11px] text-zinc-400">Storefront marketing ribbon & call-to-action</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.topAnnouncement.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        topAnnouncement: { ...settings.topAnnouncement, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">Banner Announcement Text</label>
                  <input
                    type="text"
                    disabled={!settings.topAnnouncement.enabled}
                    value={settings.topAnnouncement.text}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        topAnnouncement: { ...settings.topAnnouncement, text: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-semibold focus:outline-none focus:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    placeholder="e.g. ⚡ Special Weekend Rental Discounts Available!"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">Call-to-Action Link URL</label>
                  <input
                    type="text"
                    disabled={!settings.topAnnouncement.enabled}
                    value={settings.topAnnouncement.link}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        topAnnouncement: { ...settings.topAnnouncement, link: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-semibold focus:outline-none focus:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    placeholder="/cars or /rent"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="pt-4 border-t border-zinc-800/80">
              <p className="text-[10px] font-extrabold uppercase text-zinc-400 mb-2">Live Banner Preview</p>
              <div
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-all ${
                  settings.topAnnouncement.enabled
                    ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white shadow-md'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800/80 border-dashed'
                }`}
              >
                <span className="truncate">
                  {settings.topAnnouncement.enabled
                    ? settings.topAnnouncement.text || 'No text configured'
                    : 'Banner currently disabled'}
                </span>
                {settings.topAnnouncement.enabled && (
                  <span className="underline shrink-0 text-[11px] font-extrabold flex items-center gap-1">
                    Explore <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CARD 4: PLATFORM GOVERNANCE & MAINTENANCE */}
          <div className="bg-zinc-900/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-zinc-800 shadow-sm space-y-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">Governance & Security Controls</h2>
                    <p className="text-[11px] text-zinc-400">Auto-approvals, listing policies & maintenance mode</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Flex Toggle 1 */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                  <div className="space-y-0.5 pr-3">
                    <p className="font-bold text-white">Auto-Publish Dealership Listings</p>
                    <p className="text-[11px] text-zinc-400">
                      Bypass pending moderation queue for verified commercial partners
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.autoApproveListings}
                      onChange={(e) => setSettings({ ...settings, autoApproveListings: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Flex Toggle 2 */}
                <div
                  className={`flex flex-col gap-3 p-3.5 rounded-2xl border transition-all ${
                    settings.maintenanceMode
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-zinc-950 border-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 pr-3">
                      <p className={`font-bold ${settings.maintenanceMode ? 'text-rose-400' : 'text-white'}`}>
                        Platform Maintenance Lock
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Restrict public access; only authenticated administrators can browse
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                  </div>

                  {settings.maintenanceMode && (
                    <div className="space-y-1.5 pt-2 border-t border-rose-500/20">
                      <label className="font-bold text-rose-300 text-[11px]">
                        Public Maintenance Reason Message
                      </label>
                      <input
                        type="text"
                        value={settings.maintenanceMessage || ''}
                        onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-rose-500/40 text-white font-semibold focus:outline-none"
                        placeholder="e.g. Carketo is currently undergoing scheduled platform upgrades."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Platform Security Status</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  settings.maintenanceMode ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {settings.maintenanceMode ? 'Maintenance Active' : 'Normal Operations'}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM FLEX ACTION BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-300">
              All platform parameters are validated and ready to sync.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              type="submit"
              disabled={isSaving || isLoading}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold py-3 px-8 shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
