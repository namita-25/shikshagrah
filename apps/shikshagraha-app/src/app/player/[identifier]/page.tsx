'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { SunbirdPlayer, Layout } from '@shared-lib';

export default function PlayerPage({
  params,
}: {
  params: { identifier: string };
}) {
  // Access the identifier from the URL
  if (!params.identifier) {
    return <div>Loading...</div>;
  }

  return (
    <Layout
      isFooter={false}
      backIconClick={() => window.history.back()}
      showBack
    >
      <SunbirdPlayer identifier={params.identifier ? params.identifier : ''} />
    </Layout>
  );
}
