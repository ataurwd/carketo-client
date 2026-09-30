'use client';

import React from 'react';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { HelpCircle, Sparkles } from 'lucide-react';

export default function FAQPage() {
  const rentalFaqs: AccordionItem[] = [
    {
      id: 'license',
      title: 'গাড়ি ভাড়া নিতে কী কী কাগজপত্র প্রয়োজন?',
      content:
        'আপনার একটি বৈধ ড্রাইভিং লাইসেন্স (কমপক্ষে ১ বছরের মেয়াদী), জাতীয় পরিচয়পত্র (NID) বা পাসপোর্ট এবং সিকিউরিটি ডিপোজিটের জন্য একটি বৈধ পেমেন্ট মাধ্যম প্রয়োজন হবে।',
    },
    {
      id: 'insurance',
      title: 'ভাড়ার মূল্যের মধ্যে কি বীমা অন্তর্ভুক্ত আছে?',
      content:
        'হ্যাঁ! কারকেটো-র সকল ভাড়ার গাড়িতে মৌলিক বীমা সুবিধা অন্তর্ভুক্ত থাকে। অতিরিক্ত সুরক্ষার বিষয়ে আপনি সরাসরি গাড়ির মালিকের সাথে আলোচনা করতে পারেন।',
    },
    {
      id: 'deposit',
      title: 'আমার সিকিউরিটি ডিপোজিট কখন এবং কীভাবে ফেরত দেওয়া হবে?',
      content:
        'গাড়ি ফেরত দেওয়ার পর এবং সাধারণ পরিদর্শনের পর তাৎক্ষণিকভাবে সিকিউরিটি ডিপোজিট ফেরত দেওয়া হয় (ব্যাংকের ক্ষেত্রে ২৪ থেকে ৭২ ঘণ্টার মধ্যে অ্যাকাউন্টে জমা হয়)।',
    },
    {
      id: 'mileage',
      title: 'ভাড়ার গাড়িতে কি মাইলেজের কোনো সীমা আছে?',
      content:
        'আমাদের বেশিরভাগ ভাড়ার গাড়িতে আনলিমিটেড মাইলেজ সুবিধা রয়েছে। তবে বিশেষ কিছু প্রিমিয়াম গাড়ির ক্ষেত্রে দৈনিক নির্দিষ্ট মাইলেজ সীমা থাকতে পারে।',
    },
    {
      id: 'cancellation',
      title: 'আপনাদের বুকিং বাতিল এবং রিফান্ড নীতিমালা কী?',
      content:
        'নির্ধারিত পিকআপ সময়ের ২৪ ঘণ্টা আগে বুকিং বাতিল করলে কোনো জরিমানা ছাড়াই ১০০% রিফান্ড পাওয়া যায়।',
    },
  ];

  const salesFaqs: AccordionItem[] = [
    {
      id: 'inspection',
      title: 'কারকেটো-তে বিক্রয়ের জন্য গাড়ি কীভাবে যাচাই করা হয়?',
      content:
        'বিক্রয়ের জন্য তালিকাভুক্ত প্রতিটি গাড়ি ১৫০-পয়েন্ট যান্ত্রিক, কাঠামোগত এবং বৈদ্যুতিক ডায়াগনস্টিক পরীক্ষার মাধ্যমে যাচাই করা হয় এবং লিস্টিং পেজেই বিস্তারিত তথ্য দেওয়া থাকে।',
    },
    {
      id: 'financing',
      title: 'আপনারা কি কার লোন বা ফাইন্যান্সিং এবং এক্সচেঞ্জ সুবিধা দেন?',
      content:
        'হ্যাঁ, আমাদের সার্টিফায়েড ডিলারশিপ পার্টনাররা সহজ শর্তে কার লোন এবং পুরাতন গাড়ি এক্সচেঞ্জের সুবিধা প্রদান করে। আপনি যেকোনো গাড়ির পেজ থেকে সরাসরি জিজ্ঞাসা পাঠাতে পারেন।',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>সহায়তা কেন্দ্র</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black">সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto">
            গাড়ি ভাড়া, গাড়ি ক্রয়, বীমা এবং বিজ্ঞাপন প্রকাশ সম্পর্কিত সাধারণ প্রশ্নগুলোর উত্তর এখানে পাবেন।
          </p>
        </div>

        {/* Rental FAQs */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-black border-b border-zinc-100 pb-3">
            গাড়ি ভাড়া সংক্রান্ত প্রশ্নাবলী
          </h2>
          <Accordion items={rentalFaqs} defaultOpenId="license" />
        </div>

        {/* Sales FAQs */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-black border-b border-zinc-100 pb-3">
            গাড়ি ক্রয় ও ফাইন্যান্সিং
          </h2>
          <Accordion items={salesFaqs} defaultOpenId="inspection" />
        </div>
      </div>
    </div>
  );
}
