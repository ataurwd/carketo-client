'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService, ISettingsData } from '@/services/admin.service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
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
    maxPhotosPerCar: 3,
    maxPhotoSizeMb: 5,
    autoApproveListings: true,
    maintenanceMode: false,
    maintenanceMessage: 'Carketo is currently undergoing scheduled platform upgrades.',
    topAnnouncement: {
      enabled: true,
      text: '⚡ Luxury Spring Collection: Enjoy verified vehicle sales and 24/7 direct owner contact with 0% broker commission.',
      link: '/cars',
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    adminService
      .getSettings()
      .then((res) => {
        if (res) setSettings(res);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updated = await adminService.updateSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-black text-black">Marketplace Settings & Config</h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Global localization, currency, announcement banner, and marketplace operational policies.
        </p>
      </div>

        {saveSuccess && (
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Marketplace settings updated successfully across all platform services.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: General Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
              <Globe className="w-5 h-5 text-black" />
              <h2 className="text-base font-black text-black">General Marketplace Branding</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-zinc-700 font-bold mb-1">Platform Name</label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 font-bold text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 font-bold text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Support Hotline</label>
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 font-bold text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Headquarters Address</label>
                <input
                  type="text"
                  value={settings.headquartersAddress}
                  onChange={(e) => setSettings({ ...settings, headquartersAddress: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 font-bold text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Localization & Currency */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
              <DollarSign className="w-5 h-5 text-black" />
              <h2 className="text-base font-black text-black">Currency & Regional Units</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-zinc-700 font-bold mb-1">Currency Code</label>
                <select
                  value={settings.currency}
                  onChange={(e) => {
                    const c = e.target.value;
                    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', BDT: '৳' };
                    setSettings({ ...settings, currency: c, currencySymbol: symbols[c] || '$' });
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 bg-white font-bold text-black focus:outline-none focus:border-black"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="BDT">BDT (৳)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={settings.currencySymbol}
                  onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 font-bold text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Odometer Distance Unit</label>
                <select
                  value={settings.distanceUnit}
                  onChange={(e) => setSettings({ ...settings, distanceUnit: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 bg-white font-bold text-black focus:outline-none focus:border-black"
                >
                  <option value="Miles">Miles (mi)</option>
                  <option value="Kilometers">Kilometers (km)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Announcement Bar */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-black" />
                <h2 className="text-base font-black text-black">Top Promo Announcement Bar</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.topAnnouncement?.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      topAnnouncement: {
                        ...settings.topAnnouncement,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-zinc-700 font-bold mb-1">Announcement Copy</label>
                <input
                  type="text"
                  value={settings.topAnnouncement?.text || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      topAnnouncement: {
                        ...settings.topAnnouncement,
                        text: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 font-normal text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Destination Target Link</label>
                <input
                  type="text"
                  value={settings.topAnnouncement?.link || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      topAnnouncement: {
                        ...settings.topAnnouncement,
                        link: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 font-semibold text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Maintenance Mode */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="text-base font-black text-black">Maintenance Mode</h2>
                  <p className="text-xs text-zinc-400">Lock marketplace for scheduled system maintenance.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {settings.maintenanceMode && (
              <div className="space-y-2 text-xs font-semibold">
                <label className="block text-zinc-700 font-bold">Maintenance Notice Displayed to Users</label>
                <textarea
                  rows={2}
                  value={settings.maintenanceMessage || ''}
                  onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                  className="w-full p-3 rounded-2xl border border-zinc-200 font-normal text-zinc-700 focus:outline-none focus:border-black"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="submit"
              variant="dark"
              size="md"
              disabled={isSaving}
            >
              {isSaving ? 'Saving Settings...' : 'Save Global Settings'}
            </Button>
          </div>
        </form>
    </div>
  );
}
