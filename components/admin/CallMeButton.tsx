import React, { useState } from 'react';
import { PhoneIcon, ExclamationTriangleIcon, CheckCircleIcon, XIcon } from './icons';

interface CallMeButtonProps {
  className?: string;
}

const CallMeButton: React.FC<CallMeButtonProps> = ({ className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Check if it's a valid format
    const phoneRegex = /^(\+1|1)?[\d]{10}$/;
    const intlRegex = /^\+[\d]{10,15}$/;
    
    return phoneRegex.test(cleaned) || intlRegex.test(cleaned);
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it starts with 1 but no +, add +
    if (cleaned.startsWith('1') && !cleaned.startsWith('+')) {
      return '+' + cleaned;
    }
    
    // If it's 10 digits, assume US number
    if (cleaned.length === 10) {
      return '+1' + cleaned;
    }
    
    // If it doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      return '+' + cleaned;
    }
    
    return cleaned;
  };

  const handleCall = async () => {
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter a phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setErrorMessage('Please enter a valid phone number (e.g., +1234567890 or 234-567-8900)');
      return;
    }

    setIsLoading(true);
    setCallStatus('calling');
    setErrorMessage('');

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      const response = await fetch('/api/call-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          userInfo: {
            timestamp: new Date().toISOString(),
            source: 'admin-dashboard'
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCallStatus('success');
        setTimeout(() => {
          setIsModalOpen(false);
          setCallStatus('idle');
          setPhoneNumber('');
        }, 3000);
      } else {
        setCallStatus('error');
        setErrorMessage(result.error || 'Failed to initiate call');
      }
    } catch (error) {
      setCallStatus('error');
      setErrorMessage('Network error. Please try again.');
      console.error('Call initiation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setPhoneNumber('');
    setCallStatus('idle');
    setErrorMessage('');
  };

  return (
    <>
      {/* Call Me Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${className}`}
      >
        <PhoneIcon className="h-5 w-5 mr-2" />
        Call Me
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Request a Call Back
                </h3>
                <button
                  onClick={resetModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {callStatus === 'idle' && (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter your phone number and our AI assistant will call you to help file a complaint.
                  </p>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (234) 567-8900"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                    {errorMessage && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errorMessage}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          <strong>What to expect:</strong>
                        </p>
                        <ul className="mt-2 text-sm text-blue-600 list-disc list-inside">
                          <li>AI assistant will call you within moments</li>
                          <li>You&apos;ll be asked for your name and email</li>
                          <li>Choose the department and category</li>
                          <li>Describe your complaint in detail</li>
                          <li>Confirm and submit your complaint</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {callStatus === 'calling' && (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-lg font-medium text-gray-900">Initiating Call...</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Calling {phoneNumber}
                  </p>
                </div>
              )}

              {callStatus === 'success' && (
                <div className="text-center py-6">
                  <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">Call Initiated!</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your phone should be ringing now. Please answer to speak with our AI assistant.
                  </p>
                </div>
              )}

              {callStatus === 'error' && (
                <div className="text-center py-6">
                  <ExclamationTriangleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">Call Failed</p>
                  <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                  <button
                    onClick={() => setCallStatus('idle')}
                    className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {callStatus === 'idle' && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={resetModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCall}
                  disabled={isLoading || !phoneNumber.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Calling...' : 'Call Me Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CallMeButton;