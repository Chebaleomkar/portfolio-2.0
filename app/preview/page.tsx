'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PreviewPage() {
    const searchParams = useSearchParams();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('Loading...');

    useEffect(() => {
        try {
            const dataParam = searchParams.get('data');
            if (dataParam) {
                const data = JSON.parse(decodeURIComponent(dataParam));
                const html = Buffer.from(data.html, 'base64').toString('utf8');
                setContent(html);
                setTitle(data.title || 'Preview');
            }
        } catch (error) {
            setContent('<p>Error loading preview</p>');
        }
    }, [searchParams]);

    return (
        <div className="preview-container">
            <div dangerouslySetInnerHTML={{ __html: content }} />
            <style jsx global>{`
        body {
          font-family: system-ui, sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
        }
        article {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
      `}</style>
        </div>
    );
}
