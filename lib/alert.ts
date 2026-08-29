import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

/**
 * Custom styled SweetAlert2 theme matching Karketo Luxury UI
 */
const customSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-3xl p-6 sm:p-8 font-sans shadow-2xl border border-zinc-200 bg-white text-zinc-900',
    title: 'text-xl font-black text-black tracking-tight',
    htmlContainer: 'text-sm text-zinc-600 font-medium mt-2 leading-relaxed',
    confirmButton:
      'px-6 py-3 rounded-full font-bold text-sm bg-black text-white hover:bg-zinc-800 transition-all shadow-md active:scale-95 cursor-pointer mx-1.5',
    cancelButton:
      'px-6 py-3 rounded-full font-bold text-sm bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer mx-1.5',
    denyButton:
      'px-6 py-3 rounded-full font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-md active:scale-95 cursor-pointer mx-1.5',
    actions: 'flex items-center justify-center gap-3 mt-6',
  },
  buttonsStyling: false,
  backdrop: 'rgba(0, 0, 0, 0.45)',
  showClass: {
    popup: 'animate-in fade-in zoom-in-95 duration-200',
  },
  hideClass: {
    popup: 'animate-out fade-out zoom-out-95 duration-150',
  },
});

export const confirmDialog = async (options: {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
  isDestructive?: boolean;
}): Promise<boolean> => {
  const result: SweetAlertResult = await customSwal.fire({
    title: options.title,
    text: options.text,
    icon: options.icon || 'warning',
    iconColor: options.isDestructive ? '#e11d48' : '#000000',
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'Confirm',
    cancelButtonText: options.cancelButtonText || 'Cancel',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-3xl p-6 sm:p-8 font-sans shadow-2xl border border-zinc-200 bg-white text-zinc-900',
      title: 'text-xl font-black text-black tracking-tight',
      htmlContainer: 'text-sm text-zinc-600 font-medium mt-2 leading-relaxed',
      confirmButton: options.isDestructive
        ? 'px-6 py-3 rounded-full font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-md active:scale-95 cursor-pointer mx-1.5'
        : 'px-6 py-3 rounded-full font-bold text-sm bg-black text-white hover:bg-zinc-800 transition-all shadow-md active:scale-95 cursor-pointer mx-1.5',
      cancelButton:
        'px-6 py-3 rounded-full font-bold text-sm bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer mx-1.5',
      actions: 'flex items-center justify-center gap-3 mt-6',
    },
  });

  return result.isConfirmed;
};

export const showSuccess = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'success',
    iconColor: '#10b981',
    title,
    text,
    timer: 2500,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export const showError = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'error',
    iconColor: '#e11d48',
    title,
    text,
    confirmButtonText: 'Understood',
  });
};

export const showToast = (title: string, icon: 'success' | 'error' | 'info' | 'warning' = 'success') => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'rounded-2xl p-3 shadow-lg border border-zinc-200 bg-white text-zinc-800 text-xs font-bold font-sans',
    },
  });
};

export default customSwal;
