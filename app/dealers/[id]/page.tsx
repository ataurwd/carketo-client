import React from 'react';
import { Metadata } from 'next';
import DealerProfileClient from './DealerProfileClient';

export function generateStaticParams() {
  return [{ id: 'default' }, { id: 'seller' }];
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: 'বিক্রেতা প্রোফাইল ও গাড়িসমূহ | ক্যারকেটো',
    description:
      'এই বিক্রেতার আপলোডকৃত সকল ভাড়ার ও বিক্রয়ের যাচাইকৃত গাড়ি দেখুন। সরাসরি মালিকের সাথে যোগাযোগ করুন।',
  };
}

export default function DealerPage({
  params,
}: {
  params: { id: string };
}) {
  return <DealerProfileClient dealerId={params.id} />;
}
