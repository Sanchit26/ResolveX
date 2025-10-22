import { NextRequest, NextResponse } from 'next/server';
import { UploadService } from '@/lib/upload-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
  const file = formData.get('file') as File;
  const type = (formData.get('type') as string) || 'image'; // 'image' | 'document' | 'video'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 10MB allowed.' },
        { status: 400 }
      );
    }

    // Validate file type
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    
    if (type === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid image format. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }
    
    if (type === 'document' && !allowedDocumentTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid document format. Allowed: PDF, DOC, DOCX, TXT' },
        { status: 400 }
      );
    }
    if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid video format. Allowed: MP4, WebM, OGG, MOV' },
        { status: 400 }
      );
    }

    const uploadService = UploadService.getInstance();
    const buffer = Buffer.from(await file.arrayBuffer());
    
    let uploadResult;
    if (type === 'image') {
      uploadResult = await uploadService.uploadImage(buffer);
    } else if (type === 'video') {
      uploadResult = await uploadService.uploadVideo(buffer);
    } else {
      uploadResult = await uploadService.uploadDocument(buffer);
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      format: uploadResult.format,
      size: uploadResult.size,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
