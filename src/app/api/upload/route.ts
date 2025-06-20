import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdirSync } from 'fs';

// Get the base URL for static assets - adjust this based on your hosting environment
const getBaseUrl = () => {
  // In development, use /uploads directly (Next.js serves from public/)
  // In production, you might need to adjust this path based on your hosting setup
  return process.env.NEXT_PUBLIC_UPLOADS_PATH || '/uploads';
};

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = join(process.cwd(), 'public/uploads');
  
  try {
    mkdirSync(uploadsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
    return NextResponse.json({ success: false, error: 'Could not create upload directory' }, { status: 500 });
  }

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const path = join(uploadsDir, filename);
  
  try {
    await writeFile(path, buffer);
    console.log(`Uploaded file saved to: ${path}`);
    const baseUrl = getBaseUrl();
    const imageUrl = `${baseUrl}/${filename}`.replace(/\/\//g, '/'); // Ensure no double slashes
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, error: 'Could not save file' }, { status: 500 });
  }
}
