'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Mic, MicOff, Camera, Upload, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceImageComplaintFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  enableVoice?: boolean;
  title?: string;
  subtitle?: string;
}

export default function VoiceImageComplaintForm({
  onSubmit,
  onCancel,
  enableVoice = true,
  title = 'File Complaint with Voice & Images',
  subtitle = 'Speak about the issue and attach supporting photos for faster resolution.',
}: VoiceImageComplaintFormProps) {
  const submissionMode = enableVoice ? 'voice-image' : 'photo-only';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    category: '',
    description: '',
    images: [] as string[],
    location: {
      latitude: 0,
      longitude: 0,
      address: '',
    },
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<Array<{ file: File; preview: string }>>([]);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const urls = previewUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started...');
    } catch (error) {
      toast.error('Failed to start recording');
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    try {
      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-input.wav');

      const response = await fetch('/api/voice-to-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setTranscription(data.transcription.text);
        setFormData(prev => ({
          ...prev,
          description: data.complaint.description,
          department: data.complaint.department,
          category: data.complaint.category,
        }));
        toast.success('Voice processed successfully!');
      } else {
        toast.error('Failed to process voice input');
      }
    } catch (error) {
      toast.error('Error processing voice input');
      console.error('Voice processing error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Image upload and analysis
  const onDrop = async (acceptedFiles: File[]) => {
    try {
      setIsAnalyzing(true);
      
      for (const file of acceptedFiles) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);
        
        if (formData.location?.latitude && formData.location?.longitude) {
          uploadFormData.append('latitude', formData.location.latitude.toString());
          uploadFormData.append('longitude', formData.location.longitude.toString());
        }

        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await response.json();

        if (data.success) {
          const previewUrl = URL.createObjectURL(file);
          previewUrlsRef.current.push(previewUrl);
          setImageAnalysis(data.analysis);
          setFormData(prev => ({
            ...prev,
            description: data.description,
            department: data.analysis.department,
            category: data.analysis.category,
            images: [...prev.images, data.imageUrl],
          }));
          setUploadedImages(prev => [...prev, { file, preview: previewUrl }]);
          toast.success('Image analyzed successfully!');
        } else {
          toast.error('Failed to analyze image');
        }
      }
    } catch (error) {
      toast.error('Error analyzing image');
      console.error('Image analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Location detection
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: '',
            },
          }));
          toast.success('Location detected!');
        },
        (error) => {
          toast.error('Failed to get location');
          console.error('Location error:', error);
        }
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  // Camera capture
  const captureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            await onDrop([file]);
          }
          stream.getTracks().forEach(track => track.stop());
        }, 'image/jpeg');
      };
    } catch (error) {
      toast.error('Failed to access camera');
      console.error('Camera error:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      uploadedImages: uploadedImages.map(({ file }) => file),
      uploadedImagePreviews: uploadedImages.map(({ preview }) => preview),
      imageAnalysis,
      transcription,
      submissionMode,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-center">{title}</h2>
      <p className="text-center text-gray-500 mb-6">{subtitle}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Voice Recording Section */}
        {enableVoice && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Mic className="mr-2" />
              Voice Complaint
            </h3>
            
            <div className="flex items-center space-x-4 mb-4">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isAnalyzing}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } disabled:opacity-50`}
              >
                {isRecording ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              
              {isAnalyzing && (
                <div className="flex items-center text-gray-600">
                  <Loader2 className="mr-2 animate-spin" />
                  Processing...
                </div>
              )}
            </div>

            {transcription && (
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600 mb-2">Transcription:</p>
                <p className="text-gray-800">{transcription}</p>
              </div>
            )}
          </div>
        )}

        {/* Image Upload Section */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Camera className="mr-2" />
            Photo Evidence
          </h3>
          
          <div className="flex items-center space-x-4 mb-4">
            <button
              type="button"
              onClick={captureImage}
              disabled={isAnalyzing}
              className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              <Camera className="mr-2" />
              Take Photo
            </button>
            
            <button
              type="button"
              onClick={getCurrentLocation}
              className="flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
            >
              <MapPin className="mr-2" />
              Get Location
            </button>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              {isDragActive
                ? 'Drop the images here...'
                : 'Drag & drop images here, or click to select files'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports JPEG, PNG, GIF, WebP (max 10MB each)
            </p>
          </div>

          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {uploadedImages.map(({ file, preview }, index) => (
                  <div key={`${file.name}-${index}`} className="relative">
                    <Image
                      src={preview}
                      alt={`Upload ${index + 1}`}
                      width={200}
                      height={200}
                      className="h-24 w-full rounded border object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Analysis Results */}
        {imageAnalysis && (
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">AI Analysis Results</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Detected Issue:</p>
                <p className="text-gray-800">{imageAnalysis.issueType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Suggested Department:</p>
                <p className="text-gray-800">{imageAnalysis.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Severity:</p>
                <p className="text-gray-800">{imageAnalysis.severity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Confidence:</p>
                <p className="text-gray-800">{(imageAnalysis.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Department and Category */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="form-select"
              required
            >
              <option value="">Select Department</option>
              <optgroup label="Public/Government Services">
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Transportation">Transportation</option>
                <option value="Municipal Services">Municipal Services</option>
                <option value="Police">Police</option>
                <option value="Revenue">Revenue</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Environment">Environment</option>
              </optgroup>
              <optgroup label="Internal/Corporate">
                <option value="IT Support">IT Support</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Admin & Facilities">Admin & Facilities</option>
                <option value="Technical Maintenance">Technical Maintenance</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="form-select"
              required
            >
              <option value="">Select Category</option>
              <optgroup label="General Issues">
                <option value="Infrastructure">Infrastructure</option>
                <option value="Service Delay">Service Delay</option>
                <option value="Quality Issue">Quality Issue</option>
                <option value="Staff Behavior">Staff Behavior</option>
                <option value="Corruption">Corruption</option>
                <option value="Safety Concern">Safety Concern</option>
                <option value="Documentation">Documentation</option>
                <option value="Other">Other</option>
              </optgroup>
              <optgroup label="Technical Issues">
                <option value="System Error">System Error</option>
                <option value="Login / Access Issue">Login / Access Issue</option>
                <option value="Password Reset">Password Reset</option>
                <option value="Hardware / Device Problem">Hardware / Device Problem</option>
                <option value="Network Connectivity">Network Connectivity</option>
                <option value="Software Installation">Software Installation</option>
                <option value="Email / Account Issue">Email / Account Issue</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="form-input"
            placeholder="Describe your complaint in detail..."
            required
          />
        </div>

        {/* Location Information */}
        {formData.location.latitude && formData.location.longitude && (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-2">Location Detected:</p>
            <p className="text-green-700">
              Latitude: {formData.location.latitude.toFixed(6)}, 
              Longitude: {formData.location.longitude.toFixed(6)}
            </p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            <Send className="mr-2" />
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
}
