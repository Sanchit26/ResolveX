import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
}

export class UploadService {
  private static instance: UploadService;

  private constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
      api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
    });
  }

  public static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  public async uploadImage(file: Buffer, folder: string = 'grievances'): Promise<UploadResult> {
    try {
      // Check if Cloudinary is configured
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret || 
          cloudName === 'your-cloud-name' || 
          apiKey === 'your-api-key') {
        console.warn('⚠️ Cloudinary not configured - using base64 storage');
        // Fallback to base64
        const base64 = file.toString('base64');
        const mimeType = this.getMimeType(file);
        const dataUrl = `data:${mimeType};base64,${base64}`;
        
        return {
          url: dataUrl,
          publicId: `local-${Date.now()}`,
          format: 'base64',
          size: file.length,
          width: 0,
          height: 0,
        };
      }

      // Use Cloudinary if configured
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              // Fallback to base64
              const base64 = file.toString('base64');
              const mimeType = this.getMimeType(file);
              const dataUrl = `data:${mimeType};base64,${base64}`;
              
              resolve({
                url: dataUrl,
                publicId: `local-${Date.now()}`,
                format: 'base64',
                size: file.length,
                width: 0,
                height: 0,
              });
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                size: result.bytes,
                width: result.width,
                height: result.height,
              });
            }
          }
        );

        const readableStream = new Readable();
        readableStream.push(file);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    } catch (error) {
      console.error('Upload error:', error);
      // Final fallback
      const base64 = file.toString('base64');
      const mimeType = this.getMimeType(file);
      const dataUrl = `data:${mimeType};base64,${base64}`;
      
      return {
        url: dataUrl,
        publicId: `local-${Date.now()}`,
        format: 'base64',
        size: file.length,
        width: 0,
        height: 0,
      };
    }
  }

  public async uploadVideo(file: Buffer, folder: string = 'grievances'): Promise<UploadResult> {
    try {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret || cloudName === 'your-cloud-name' || apiKey === 'your-api-key') {
        console.warn('⚠️ Cloudinary not configured - storing video as base64 (not recommended for large files)');
        const base64 = file.toString('base64');
        const dataUrl = `data:video/mp4;base64,${base64}`;
        return {
          url: dataUrl,
          publicId: `local-video-${Date.now()}`,
          format: 'base64',
          size: file.length,
          width: 0,
          height: 0,
        };
      }

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'video',
            eager: [{ format: 'mp4', quality: 'auto' }],
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary video upload error:', error);
              // Fallback to base64
              const base64 = file.toString('base64');
              const dataUrl = `data:video/mp4;base64,${base64}`;
              resolve({
                url: dataUrl,
                publicId: `local-video-${Date.now()}`,
                format: 'base64',
                size: file.length,
                width: 0,
                height: 0,
              });
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                size: result.bytes,
                width: (result as any).width,
                height: (result as any).height,
              });
            }
          }
        );

        const readableStream = new Readable();
        readableStream.push(file);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    } catch (error) {
      console.error('Video upload error:', error);
      const base64 = file.toString('base64');
      const dataUrl = `data:video/mp4;base64,${base64}`;
      return {
        url: dataUrl,
        publicId: `local-video-${Date.now()}`,
        format: 'base64',
        size: file.length,
        width: 0,
        height: 0,
      };
    }
  }

  private getMimeType(buffer: Buffer): string {
    // Simple MIME type detection based on file signature
    const signature = buffer.toString('hex', 0, 4);
    
    if (signature.startsWith('89504e47')) return 'image/png';
    if (signature.startsWith('ffd8ff')) return 'image/jpeg';
    if (signature.startsWith('47494638')) return 'image/gif';
    if (signature.startsWith('52494646')) return 'image/webp';
    
    return 'image/jpeg'; // default
  }

  public async uploadDocument(file: Buffer, folder: string = 'documents'): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'raw',
          allowed_formats: ['pdf', 'doc', 'docx', 'txt'],
          max_bytes: 10 * 1024 * 1024, // 10MB limit
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              size: result.bytes,
            });
          }
        }
      );

      const readableStream = new Readable();
      readableStream.push(file);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  public async deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  public async getFileInfo(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.api.resource(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  public generateUploadUrl(folder: string = 'grievances'): string {
    return cloudinary.url(folder, {
      sign_url: true,
      type: 'upload',
      expires_at: Math.round(Date.now() / 1000) + 3600, // 1 hour
    });
  }
}
