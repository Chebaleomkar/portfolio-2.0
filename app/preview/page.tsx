import { Suspense } from 'react';
import PreviewClient from './PreviewClient';

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading preview...</p>
      </div>
    }>
      <PreviewClient />
    </Suspense>
  );
}
