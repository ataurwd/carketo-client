import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Car } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-brand-50 text-brand flex items-center justify-center shadow-glow">
          <Car className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-black text-slate-900">404</span>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-xs text-slate-500">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
