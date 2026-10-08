import React from 'react';
import { Metadata } from 'next';
import { CarEditForm } from '@/components/common/CarEditForm';

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export const metadata: Metadata = {
  title: 'গাড়ি সম্পাদনা | কারকেটো অ্যাডমিন',
  description: 'ইনভেন্টরির গাড়ির তথ্য, মূল্য, ছবি ও স্ট্যাটাস আপডেট করুন।',
};

export default function AdminCarEditPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <CarEditForm
      carId={params.id}
      returnUrl="/admin/cars"
      isAdmin={true}
    />
  );
}
