'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function PreviewContent() {
    const searchParams = useSearchParams();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('Loading...');
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const dataParam = searchParams.get('data');

            if (!dataParam) {
                setError('No preview data found');
                return;
            }

            const data = JSON.parse(decodeURIComponent(dataParam));

            // ✅ FIX: Use atob() instead of Buffer for base64 decoding
            const html = atob(data.html);

            setContent(html);
            setTitle(data.title || 'Preview');

        } catch (err) {
            console.error('Preview error:', err);
            setError('Error loading preview: ' + err.message);
            setContent('<p style="color: red;">Failed to decode HTML content</p>');
        }
    }, [searchParams]);

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1 style={{ color: '#e53e3e' }}>⚠️ Preview Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <div className="preview-container">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>

            <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }
        .preview-container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 20px;
        }
        article {
          line-height: 1.6;
        }
        img { 
          max-width: 100%; 
          height: auto;
          border-radius: 8px;
          margin: 20px 0;
        }
        h1 { 
          color: #1a202c; 
          margin-bottom: 20px;
          font-size: 2rem;
        }
        h2 { 
          color: #2d3748; 
          margin-top: 30px;
          margin-bottom: 15px;
          font-size: 1.5rem;
        }
        h3 {
          color: #4a5568;
          margin-top: 20px;
          margin-bottom: 10px;
          font-size: 1.25rem;
        }
        p {
          margin-bottom: 15px;
          color: #4a5568;
        }
        ul, ol {
          margin: 15px 0 15px 30px;
        }
        li {
          margin-bottom: 8px;
          color: #4a5568;
        }
        a {
          color: #3182ce;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        strong {
          color: #2d3748;
          font-weight: 600;
        }
        @media (max-width: 768px) {
          body {
            padding: 10px;
          }
          .preview-container {
            padding: 20px;
          }
          h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
        </>
    );
}

export default function PreviewPage() {
    return (
        <Suspense fallback={
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>Loading preview...</p>
            </div>
        }>
            <PreviewContent />
        </Suspense>
    );
}
