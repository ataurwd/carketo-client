import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">তথ্য সুরক্ষা</span>
          <h1 className="text-3xl font-black text-black mt-1">গোপনীয়তা ও নিরাপত্তা নীতিমালা</h1>
          <p className="text-xs text-zinc-400 mt-1">সর্বশেষ আপডেট: আগস্ট ২০২৬</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">১. আমরা যেসব তথ্য সংগ্রহ করি</h2>
            <p>
              রেজিস্ট্রেশন এবং বুকিংয়ের সময় আপনার প্রদত্ত তথ্য যেমন আপনার পূর্ণ নাম, ইমেইল ঠিকানা, ফোন নম্বর, ড্রাইভিং লাইসেন্সের বিবরণ এবং বিলিং তথ্য আমরা সংগ্রহ করি। শুধুমাত্র সড়ক নিরাপত্তা এবং গাড়ি ব্যবস্থাপনার জন্য ডায়াগনস্টিক ডেটা সংগ্রহ করা হয়।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">২. আমরা কীভাবে আপনার তথ্য সুরক্ষিত রাখি</h2>
            <p>
              কারকেটো সকল নেটওয়ার্ক যোগাযোগে ২৫৬-বিট TLS এনক্রিপশন ব্যবহার করে। পাসওয়ার্ডগুলো ক্রিপ্টোগ্রাফিক হ্যাশিংয়ের মাধ্যমে সংরক্ষিত থাকে এবং সংবেদনশীল পেমেন্ট তথ্য নিরাপদ পেমেন্ট গেটওয়ের মাধ্যমে পরিচালিত হয়।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">৩. কুকিজ ও সেশন স্টোরেজ</h2>
            <p>
              আপনার লগইন সেশন নিরাপদে বজায় রাখতে আমরা নিরাপদ অথেনটিকেশন কুকিজ ব্যবহার করি, যা তৃতীয় পক্ষের ট্র্যাকিং স্ক্রিপ্টের কাছে উন্মুক্ত করা হয় না।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">৪. আপনার অধিকার ও তথ্য মুছে ফেলা</h2>
            <p>
              আপনি যেকোনো সময় আপনার অ্যাকাউন্ট সেটিংস থেকে অথবা concierge@carketo.com-এ যোগাযোগ করে আপনার অ্যাকাউন্ট এবং ব্যক্তিগত তথ্য পরিদর্শন, এক্সপোর্ট বা স্থায়ীভাবে মুছে ফেলার অনুরোধ করার পূর্ণ অধিকার রাখেন।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
