import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdirSync } from 'fs';

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
    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, error: 'Could not save file' }, { status: 500 });
  }
}
