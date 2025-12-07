'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PreviewClient() {
  const searchParams = useSearchParams();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Loading...');

  useEffect(() => {
    const dataParam = searchParams.get('data');

    if (!dataParam) {
      setContent('<p>No preview data found</p>');
      setTitle('Preview');
      return;
    }

    // Decode URI component
    let decodedParam;
    try {
      decodedParam = decodeURIComponent(dataParam);
    } catch {
      decodedParam = dataParam;
    }

    // Extract whatever valid JSON we can find
    let html = '';
    let extractedTitle = 'Preview';

    // Try to find the html field even in partial/broken JSON
    const htmlMatch = decodedParam.match(/"html"\s*:\s*"([^"]*)"/);
    if (htmlMatch) {
      const base64Content = htmlMatch[1];

      // Try to decode base64, handling partial/corrupted data
      try {
        html = atob(base64Content);
      } catch {
        // If base64 decode fails, try decoding progressively smaller chunks
        for (let i = base64Content.length; i > 0; i -= 4) {
          try {
            const chunk = base64Content.substring(0, i);
            // Ensure proper padding
            const paddedChunk = chunk + '='.repeat((4 - (chunk.length % 4)) % 4);
            html = atob(paddedChunk);
            break;
          } catch {
            continue;
          }
        }
      }
    }

    // If no html field found, try to extract raw content
    if (!html) {
      // Look for any base64-like content
      const base64Pattern = /[A-Za-z0-9+/]{20,}={0,2}/g;
      const matches = decodedParam.match(base64Pattern);

      if (matches) {
        for (const match of matches) {
          try {
            const decoded = atob(match);
            if (decoded.includes('<') && decoded.includes('>')) {
              html = decoded;
              break;
            }
          } catch {
            // Try with padding
            try {
              const padded = match + '='.repeat((4 - (match.length % 4)) % 4);
              const decoded = atob(padded);
              if (decoded.includes('<') && decoded.includes('>')) {
                html = decoded;
                break;
              }
            } catch {
              continue;
            }
          }
        }
      }
    }

    // Try to extract title
    const titleMatch = decodedParam.match(/"title"\s*:\s*"([^"]*)"/);
    if (titleMatch) {
      extractedTitle = titleMatch[1];
    }

    // If we found some HTML content, use it
    if (html && html.trim()) {
      setContent(html);
      setTitle(extractedTitle);
    } else {
      // Fallback: show whatever we can extract
      setContent('<p>Unable to extract preview content from data</p>');
      setTitle('Preview');
    }
  }, [searchParams]);

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