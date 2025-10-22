import { NextRequest, NextResponse } from 'next/server';
import { VoiceService } from '@/lib/voice-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/m4a', 'audio/webm'];
    if (!allowedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        { error: 'Invalid audio format. Allowed: WAV, MP3, M4A, WebM' },
        { status: 400 }
      );
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio file too large. Maximum 25MB allowed.' },
        { status: 400 }
      );
    }

    // Convert audio to buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    
    // Transcribe audio
    const voiceService = VoiceService.getInstance();
    const transcription = await voiceService.transcribeAudio(buffer);
    
    // Analyze voice content
    const analysis = await voiceService.analyzeVoiceContent(transcription.text);
    
    // Generate structured complaint
    const complaint = await voiceService.generateComplaintFromVoice(transcription.text);

    return NextResponse.json({
      success: true,
      transcription,
      analysis,
      complaint,
    });
  } catch (error: any) {
    console.error('Voice-to-text error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice input' },
      { status: 500 }
    );
  }
}
