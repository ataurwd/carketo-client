import React from 'react';
import { Metadata } from 'next';
import DealerProfileClient from './DealerProfileClient';

export const dynamicParams = true;

export async function generateStaticParams() {
  const fallbackIds = ['default', 'seller'];
  const fetchedIds: string[] = [];

  const endpoints = [
    'http://localhost:5000/api/v1/cars?limit=100',
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/cars?limit=100`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          'X-Client-App': 'carketo-web',
          'X-Api-Key': process.env.NEXT_PUBLIC_CLIENT_API_KEY || 'carketo_sec_app_9a4f82e14cb701b2',
        },
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : (json?.data?.cars || []);
        for (const item of list) {
          const pId = item?.provider?.id || item?.providerId || item?.provider?._id || item?.userId;
          if (pId && typeof pId === 'string') fetchedIds.push(pId);
        }
      }
    } catch {
      // ignore
    }
    if (fetchedIds.length > 0) break;
  }

  const allIds = Array.from(new Set([...fallbackIds, ...fetchedIds]));
  return allIds.map((id) => ({ id }));
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
