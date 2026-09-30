import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">আইনি চুক্তি</span>
          <h1 className="text-3xl font-black text-black mt-1">সেবার শর্তাবলী ও ভাড়া চুক্তি</h1>
          <p className="text-xs text-zinc-400 mt-1">সর্বশেষ আপডেট: আগস্ট ২০২৬</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">১. শর্তাবলী গ্রহণ</h2>
            <p>
              কারকেটো (&quot;প্ল্যাটফর্ম&quot;)-এ প্রবেশ, ব্রাউজ বা বুকিং করার মাধ্যমে আপনি স্বীকার করছেন যে আপনি এই সেবার শর্তাবলী পড়েছেন, বুঝেছেন এবং মেনে চলতে সম্মত হয়েছেন। আপনি যদি এই শর্তাবলীতে সম্মত না হন, তবে অবিলম্বে আমাদের সেবা ব্যবহার বন্ধ করুন।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">২. চালকের যোগ্যতা ও যাচাইকরণ</h2>
            <p>
              সকল ভাড়াটের বয়স কমপক্ষে ২১ বছর হতে হবে এবং কমপক্ষে ১২ মাস ধরে বৈধ ড্রাইভিং লাইসেন্স থাকতে হবে। সকল চালককে আমাদের পরিচয় এবং ড্রাইভিং রেকর্ড যাচাইকরণ প্রক্রিয়া সম্পন্ন করতে হবে।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">৩. সিকিউরিটি ডিপোজিট ও পেমেন্ট অনুমোদন</h2>
            <p>
              গাড়ি হস্তান্তরের পূর্বে ভাড়াটের পেমেন্ট মাধ্যমে একটি ফেরতযোগ্য সিকিউরিটি ডিপোজিট সংরক্ষিত রাখা হতে পারে। গাড়ি কোনো ক্ষতি ছাড়া ফেরত দেওয়ার ৭২ ঘণ্টার মধ্যে এই অর্থ ফেরত দেওয়া হয়।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">৪. গাড়ি ব্যবহারের নীতিমালা</h2>
            <p>
              কারকেটো-র সকল গাড়িতে ধূমপান সম্পূর্ণ নিষিদ্ধ। লিখিত অনুমতি ছাড়া অননুমোদিত রেসিং, সাব-লিজিং বা নির্ধারিত সীমানার বাইরে গাড়ি চালানো সম্পূর্ণ নিষিদ্ধ।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">৫. বুকিং বাতিল ও রিফান্ড</h2>
            <p>
              নির্ধারিত পিকআপ সময়ের কমপক্ষে ২৪ ঘণ্টা আগে বুকিং বাতিল করলে সম্পূর্ণ অর্থ ফেরত দেওয়া হয়। ২৪ ঘণ্টার কম সময়ের মধ্যে বাতিল করলে ১ দিনের ভাড়া চার্জ প্রযোজ্য হতে পারে।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
