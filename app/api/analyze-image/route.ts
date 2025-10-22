import { NextRequest, NextResponse } from 'next/server';
import { ImageAnalysisService } from '@/lib/image-analysis-service';
import { UploadService } from '@/lib/upload-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid image format. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size too large. Maximum 10MB allowed.' },
        { status: 400 }
      );
    }

    // Upload image to cloud storage
    const uploadService = UploadService.getInstance();
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadResult = await uploadService.uploadImage(buffer, 'complaints');

    // Analyze image with AI
    const imageAnalysisService = ImageAnalysisService.getInstance();
    
    const locationData = latitude && longitude ? {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    } : undefined;

    const analysis = await imageAnalysisService.analyzeImage(uploadResult.url, locationData);
    
    // Generate description from image
    const description = await imageAnalysisService.generateDescriptionFromImage(uploadResult.url);

    return NextResponse.json({
      success: true,
      analysis,
      description,
      imageUrl: uploadResult.url,
      publicId: uploadResult.publicId,
    });
  } catch (error: any) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
