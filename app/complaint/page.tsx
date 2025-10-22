'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Bot, FileText, Mic, Image as ImageIcon, PhoneCall } from 'lucide-react';
import AIChatbot from '@/components/AIChatbot';
import SimpleCallMeButton from '@/components/SimpleCallMeButton';
import VoiceImageComplaintForm from '@/components/VoiceImageComplaintForm';

export default function ComplaintPage() {
  const [complaintType, setComplaintType] = useState<'ai' | 'manual' | null>(null);
  const [manualOption, setManualOption] = useState<'voice-image' | 'text' | 'photo-only' | 'call-back' | null>(null);
  const [success, setSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');

  // Manual submit handler shared by manual form

  const handleComplaintSubmit = async (formData: any) => {
    setError('');
    const { uploadedImages, uploadedImagePreviews, ...payload } = formData || {};
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTrackingId(data.trackingId);
      } else {
        setError(data.error || 'Failed to submit complaint');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Complaint Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your grievance has been registered and is under review. Please save your tracking ID for future reference.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Your Tracking ID:</p>
              <p className="text-2xl font-mono font-bold text-blue-600 bg-white p-3 rounded border">
                {trackingId}
              </p>
            </div>
            <div className="space-y-4">
              <Link href={`/track/${trackingId}`} className="btn-primary inline-block">
                Track Your Complaint
              </Link>
              <br />
              <Link href="/complaint" className="btn-secondary inline-block">
                Submit Another Complaint
              </Link>
              <br />
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (complaintType === 'ai') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button onClick={() => setComplaintType(null)} className="text-blue-600 hover:text-blue-700 mr-4">
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-blue-600">AI Mode</h1>
              </div>
              <div className="hidden sm:block">
                <SimpleCallMeButton inline buttonText="Call Me" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md" />
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AIChatbot embedded className="w-full" />
          <div className="mt-4 sm:hidden">
            <SimpleCallMeButton inline buttonText="Call Me" className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md" />
          </div>
        </main>
      </div>
    );
  }

  if (complaintType === 'manual') {
    if (!manualOption) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setComplaintType(null);
                      setManualOption(null);
                    }}
                    className="text-green-600 hover:text-green-700 mr-4"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  <h1 className="text-2xl font-bold text-green-600">
                    Choose Your Manual Method
                  </h1>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How would you like to submit your complaint?
              </h2>
              <p className="text-xl text-gray-600">
                Pick the method that works best for you. You can still upload photos or request a call.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              <ManualOptionCard
                icon={<Mic className="h-8 w-8 text-blue-600" />}
                title="Voice & Image Complaint"
                description="Record your voice and attach photos. Our AI will transcribe, analyze, and route it for you."
                highlights={[
                  'Voice-to-text transcription with AI auto-fill',
                  'Upload or capture photos for instant analysis',
                  'Automatic department and category suggestions',
                ]}
                ctaText="Start Voice & Image"
                onClick={() => setManualOption('voice-image')}
              />

              <ManualOptionCard
                icon={<FileText className="h-8 w-8 text-green-600" />}
                title="Text Complaint"
                description="Fill in a clean form with all the required details. Perfect when you already know what to write."
                highlights={[
                  'Simple step-by-step form',
                  'Manual department selection',
                  'Instant tracking ID on submit',
                ]}
                ctaText="Start Text Form"
                onClick={() => setManualOption('text')}
              />

              <ManualOptionCard
                icon={<ImageIcon className="h-8 w-8 text-purple-600" />}
                title="Photo-Only Complaint"
                description="Snap or upload photos, add a short note, and let AI detect the issue and department."
                highlights={[
                  'Quick uploads from camera or gallery',
                  'AI-powered image understanding',
                  'Auto-fill department and category suggestions',
                ]}
                ctaText="Upload Photos"
                onClick={() => setManualOption('photo-only')}
              />

              <ManualOptionCard
                icon={<PhoneCall className="h-8 w-8 text-orange-600" />}
                title="Get a Call Back"
                description="Prefer speaking to someone? Request a call and our AI agent will phone you in seconds."
                highlights={[
                  'Instant call-back from ResolveX AI',
                  'Guided conversation to capture details',
                  'Tracking ID sent right after the call',
                ]}
                ctaText="Request Call"
                onClick={() => setManualOption('call-back')}
              />
            </div>
          </main>
        </div>
      );
    }

    if (manualOption === 'text') {
      return <TextComplaintForm onSubmit={handleComplaintSubmit} onCancel={() => setManualOption(null)} />;
    }

    if (manualOption === 'voice-image') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center py-6">
                <button onClick={() => setManualOption(null)} className="text-green-600 hover:text-green-700 mr-4">
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-green-600">Voice & Image Complaint</h1>
              </div>
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <VoiceImageComplaintForm onSubmit={handleComplaintSubmit} onCancel={() => setManualOption(null)} />
          </main>
          <SimpleCallMeButton />
        </div>
      );
    }

    if (manualOption === 'photo-only') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center py-6">
                <button onClick={() => setManualOption(null)} className="text-green-600 hover:text-green-700 mr-4">
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-green-600">Photo-Only Complaint</h1>
              </div>
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <VoiceImageComplaintForm
              onSubmit={handleComplaintSubmit}
              onCancel={() => setManualOption(null)}
              enableVoice={false}
              title="File Complaint with Photos"
              subtitle="Upload photos, add a short note, and we will detect the issue automatically."
            />
          </main>
          <SimpleCallMeButton />
        </div>
      );
    }

    if (manualOption === 'call-back') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center py-6">
                <button onClick={() => setManualOption(null)} className="text-green-600 hover:text-green-700 mr-4">
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-green-600">Request a Call Back</h1>
              </div>
            </div>
          </header>
          <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white rounded-lg shadow-lg p-10 text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <PhoneCall className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Prefer talking to someone?</h2>
              <p className="text-lg text-gray-600">
                Click the button below and our AI voice assistant will call you within seconds to collect the details and file the complaint on your behalf.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
                <h3 className="text-lg font-semibold text-green-800 mb-3">What to expect</h3>
                <ul className="text-green-700 space-y-2 list-disc list-inside">
                  <li>Answer the incoming call from ResolveX AI</li>
                  <li>Speak naturally about your issue—we record everything securely</li>
                  <li>Our system files the complaint and texts you the tracking ID</li>
                </ul>
              </div>
              <SimpleCallMeButton inline buttonText="Call Me Now" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors" />
            </div>
          </main>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-6 w-6 mr-2" />
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">
                File a Complaint
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Complaint Type Selection */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Complaint Method
          </h2>
          <p className="text-xl text-gray-600">
            Select the most convenient way to file your grievance
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* AI Mode */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI Mode
              </h3>
              <p className="text-gray-600 mb-6">
                Chat with our AI assistant, attach files/images/videos, choose language, and even request a call. The AI will file your complaint for you.
              </p>
              <ul className="text-left text-sm text-gray-600 mb-8 space-y-2">
                <li>• Multiple languages (English, Hindi, Telugu, Marathi)</li>
                <li>• Attach images/documents/videos</li>
                <li>• Automatic department routing</li>
                <li>• Instant tracking ID after submission</li>
              </ul>
              <button
                onClick={() => {
                  setManualOption(null);
                  setError('');
                  setComplaintType('ai');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Start AI Mode
              </button>
            </div>
          </div>

          {/* Manual Mode */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Manual Mode
              </h3>
              <p className="text-gray-600 mb-6">
                Prefer typing or sharing photos? Pick between voice & photo, text form, photo-only, or a quick call back.
              </p>
              <ul className="text-left text-sm text-gray-600 mb-8 space-y-2">
                <li>• Voice + photo capture with AI assistance</li>
                <li>• Classic text-based complaint form</li>
                <li>• Photo-only upload with automatic analysis</li>
                <li>• Instant call back from ResolveX voice agent</li>
              </ul>
              <button
                onClick={() => {
                  setError('');
                  setManualOption(null);
                  setComplaintType('manual');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Start Manual Mode
              </button>
            </div>
          </div>
        </div>
      </main>
      <SimpleCallMeButton />
      <AIChatbot />
    </div>
  );
}

interface ManualOptionCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
  highlights: string[];
  ctaText: string;
  onClick: () => void;
}

function ManualOptionCard({ icon, title, description, highlights, ctaText, onClick }: ManualOptionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 flex-1">{description}</p>
      <ul className="text-sm text-gray-600 mb-8 space-y-2">
        {highlights.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
      <button
        onClick={onClick}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        {ctaText}
      </button>
    </div>
  );
}

// Text Complaint Form Component
function TextComplaintForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    category: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ ...formData, submissionMode: 'text' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={onCancel}
                className="text-green-600 hover:text-green-700 mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-green-600">
                Text Complaint Form
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Submit Your Grievance
            </h2>
            <p className="text-gray-600">
              Please fill out the form below with accurate information. All fields are required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
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

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="form-input"
                placeholder="Please describe your grievance in detail..."
                required
              />
            </div>

            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                ← Back to Options
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <SimpleCallMeButton />
    </div>
  );
}



