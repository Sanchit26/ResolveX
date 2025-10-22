import OpenAI from 'openai';

export interface ImageAnalysis {
  issueType: string;
  department: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  tags: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  confidence: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
}

export class ImageAnalysisService {
  private static instance: ImageAnalysisService;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
    });
  }

  public static getInstance(): ImageAnalysisService {
    if (!ImageAnalysisService.instance) {
      ImageAnalysisService.instance = new ImageAnalysisService();
    }
    return ImageAnalysisService.instance;
  }

  public async analyzeImage(imageUrl: string, locationData?: LocationData): Promise<ImageAnalysis> {
    try {
      // Check if API key is valid
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey || apiKey === 'your-openai-api-key' || apiKey.length < 20) {
        console.warn('⚠️ OpenAI API key not configured - using fallback analysis');
        return this.getFallbackAnalysis(locationData);
      }

      const prompt = this.generateAnalysisPrompt(locationData);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and identify the issue, department, category, and severity.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      const analysisText = response.choices[0]?.message?.content || '';
      return this.parseAnalysisResponse(analysisText, locationData);
    } catch (error) {
      console.error('Image analysis error:', error);
      return this.getFallbackAnalysis(locationData);
    }
  }

  private generateAnalysisPrompt(locationData?: LocationData): string {
    return `You are an AI expert analyzing images for a government grievance redressal portal. 

Analyze the image and provide a JSON response with the following structure:
{
  "issueType": "Brief description of the issue",
  "department": "Most appropriate department (Education, Healthcare, Transportation, Municipal Services, Police, Revenue, Agriculture, Environment, Other)",
  "category": "Category (Infrastructure, Service Delivery, Corruption, Delay in Services, Quality Issues, Billing Problems, Other)",
  "severity": "Low/Medium/High/Critical",
  "description": "Detailed description of the issue",
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.95
}

Focus on identifying:
- Garbage/waste management issues
- Infrastructure problems (roads, buildings, utilities)
- Environmental issues (pollution, water, air quality)
- Safety hazards
- Service delivery problems
- Corruption or administrative issues

${locationData ? `Location context: ${locationData.latitude}, ${locationData.longitude} - ${locationData.address || 'Unknown address'}` : ''}

Be specific and accurate. Return only valid JSON.`;
  }

  private parseAnalysisResponse(response: string, locationData?: LocationData): ImageAnalysis {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        issueType: parsed.issueType || 'Unknown Issue',
        department: parsed.department || 'Other',
        category: parsed.category || 'Other',
        severity: parsed.severity || 'Medium',
        description: parsed.description || 'Issue detected from image',
        tags: parsed.tags || [],
        location: locationData ? {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        } : undefined,
        confidence: parsed.confidence || 0.8,
      };
    } catch (error) {
      console.error('Failed to parse analysis response:', error);
      return this.getFallbackAnalysis(locationData);
    }
  }

  private getFallbackAnalysis(locationData?: LocationData): ImageAnalysis {
    return {
      issueType: 'Issue detected from image',
      department: 'Municipal Services',
      category: 'Infrastructure',
      severity: 'Medium',
      description: 'An issue has been identified from the uploaded image. Please provide additional details.',
      tags: ['image-uploaded', 'needs-review'],
      location: locationData ? {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      } : undefined,
      confidence: 0.5,
    };
  }

  public async extractLocationFromImage(imageUrl: string): Promise<LocationData | null> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: 'Extract location information from this image. Look for landmarks, street signs, building names, or any geographical indicators. Return JSON with latitude, longitude if visible, or describe the location.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'What location is shown in this image?',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 200,
      });

      const locationText = response.choices[0]?.message?.content || '';
      
      // Try to extract coordinates if present
      const coordMatch = locationText.match(/(\d+\.\d+),\s*(\d+\.\d+)/);
      if (coordMatch) {
        return {
          latitude: parseFloat(coordMatch[1]),
          longitude: parseFloat(coordMatch[2]),
        };
      }

      // Return location description
      return {
        latitude: 0,
        longitude: 0,
        address: locationText,
      };
    } catch (error) {
      console.error('Location extraction error:', error);
      return null;
    }
  }

  public async generateDescriptionFromImage(imageUrl: string): Promise<string> {
    try {
      // Check if API key is valid
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey || apiKey === 'your-openai-api-key' || apiKey.length < 20) {
        console.warn('⚠️ OpenAI API key not configured - using basic description');
        return 'Image uploaded for complaint. Please provide a detailed description of the issue in the description field.';
      }

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Describe what you see in this image in detail. Focus on any issues, problems, or concerns that would be relevant for a government grievance portal.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this image in detail.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      });

      return response.choices[0]?.message?.content || 'Image uploaded for complaint filing.';
    } catch (error) {
      console.error('Description generation error:', error);
      return 'Image uploaded for complaint filing. Please provide additional details.';
    }
  }
}
