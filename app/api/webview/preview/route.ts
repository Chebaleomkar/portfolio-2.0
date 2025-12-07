import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const dataParam = searchParams.get('data');

        if (!dataParam) {
            return new Response('Missing data parameter', { status: 400 });
        }

        // Parse the data
        const data = JSON.parse(decodeURIComponent(dataParam));
        const html = Buffer.from(data.html, 'base64').toString('utf8');

        // Create the full HTML page
        const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title || 'Preview'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
          }
          article {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            margin-bottom: 30px;
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
            line-height: 1.2;
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
          }
          figure {
            margin: 25px 0;
          }
          figcaption {
            text-align: center;
            font-size: 0.9rem;
            color: #718096;
            margin-top: 10px;
            font-style: italic;
          }
          footer {
            text-align: center;
            padding: 20px;
            color: #718096;
            font-size: 0.875rem;
            background: rgba(255,255,255,0.8);
            border-radius: 8px;
            backdrop-filter: blur(10px);
          }
          @media (max-width: 768px) {
            body {
              padding: 10px;
            }
            article {
              padding: 20px;
            }
            h1 {
              font-size: 1.5rem;
            }
            h2 {
              font-size: 1.25rem;
            }
          }
        </style>
      </head>
      <body>
        ${html}
        <footer>
          <p>📅 Generated: ${new Date(data.timestamp).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'short'
        })}</p>
          <p style="margin-top: 10px; font-size: 0.8rem;">Powered by n8n + Next.js</p>
        </footer>
      </body>
      </html>
    `;

        // Return HTML response
        return new Response(fullHTML, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });

    } catch (error) {
        console.error('Preview error:', error);
        return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f5f5f5;
            padding: 20px;
          }
          .error {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
          }
          h1 { color: #e53e3e; margin-bottom: 15px; }
          p { color: #666; }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>⚠️ Preview Error</h1>
          <p>Unable to load preview data. Please check the URL or try again.</p>
          <p style="font-size: 0.875rem; margin-top: 20px; color: #999;">
            Error: ${error.message}
          </p>
        </div>
      </body>
      </html>
    `, {
            status: 400,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
}
