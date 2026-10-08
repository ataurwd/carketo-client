import React from 'react';
import { Metadata } from 'next';
import { CarEditForm } from '@/components/common/CarEditForm';

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export const metadata: Metadata = {
  title: 'গাড়ির তথ্য সম্পাদনা | কারকেটো প্রোভাইডার',
  description: 'আপনার তালিকাভুক্ত গাড়ির বিবরণ, মূল্য, ছবি ও সুযোগ-সুবিধা আপডেট করুন।',
};

export default function ProviderCarEditPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <CarEditForm
      carId={params.id}
      returnUrl="/provider/cars"
      isAdmin={false}
    />
  );
}
