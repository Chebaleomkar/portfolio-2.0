
export const dynamic = "force-dynamic"; 

import { NextResponse } from "next/server";

export async function GET(request:NextResponse) {
    const { searchParams } = new URL(request.url);
    const fileid = searchParams.get("fileid");  

    if (!fileid) {
        return NextResponse.json({message : "Missing fileid parameter"} , { status: 400 });
    }

    try {
        // Construct the direct download URL for the PDF from Google Drive
        const pdfUrl = `https://drive.google.com/uc?export=download&id=${fileid}`;

        // Fetch the PDF from Google Drive
        const response = await fetch(pdfUrl);

        if (!response.ok) {
            
            return NextResponse.json({message : "Error retrieving google drive pdf"} , { status: 400 });
        }

        // Read the response as an ArrayBuffer
        const pdfBuffer = await response.arrayBuffer();

        // Create a new response with PDF content type and inline disposition
        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="file.pdf"',
                "Content-Length": pdfBuffer.byteLength.toString()
            }
        });
    } catch (error:any) {
        return NextResponse.json({message : "Error retrieving file" + error.message} , { status: 400 });
    }
}
