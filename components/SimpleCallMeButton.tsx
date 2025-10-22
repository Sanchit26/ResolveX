import React, { useState } from 'react';
import { PhoneIcon, ExclamationTriangleIcon, CheckCircleIcon, XIcon } from './admin/icons';

interface SimpleCallMeButtonProps {
  className?: string;
  inline?: boolean;
  buttonText?: string;
}

const SimpleCallMeButton: React.FC<SimpleCallMeButtonProps> = ({ 
  className = '', 
  inline = false, 
  buttonText = 'Call Me' 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCall = async () => {
    setIsLoading(true);
    setCallStatus('calling');
    setErrorMessage('');

    try {
      const response = await fetch('/api/call-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          useDefault: true,
          userInfo: {
            timestamp: new Date().toISOString(),
            source: 'complaint-page'
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCallStatus('success');
        setTimeout(() => {
          setIsModalOpen(false);
          setCallStatus('idle');
        }, 4000);
      } else {
        setCallStatus('error');
        setErrorMessage(result.error || 'Failed to initiate call');
      }
    } catch (error) {
      setCallStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setCallStatus('idle');
    setErrorMessage('');
  };

  return (
    <>
      {/* Call Me Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={
          inline 
            ? `${className}` 
            : `fixed bottom-6 left-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${className}`
        }
        aria-label={inline ? undefined : "Call me for help"}
      >
        {inline ? (
          buttonText
        ) : (
          <PhoneIcon className="h-6 w-6" />
        )}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Get a Call Back
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
                    Our AI assistant will call your registered number and help you file a complaint over the phone.
                  </p>
                  
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errorMessage}
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-3 mb-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          <strong>What happens when you click &quot;Call Me Now&quot;:</strong>
                        </p>
                        <ul className="mt-2 text-sm text-green-600 list-disc list-inside">
                          <li>Your registered phone will ring within seconds</li>
                          <li>Our AI will guide you through filing your complaint</li>
                          <li>All information will be saved automatically</li>
                          <li>You&apos;ll get a tracking ID for follow-up</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {callStatus === 'calling' && (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-lg font-medium text-gray-900">Calling You Now...</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Please answer your registered phone number
                  </p>
                </div>
              )}

              {callStatus === 'success' && (
                <div className="text-center py-6">
                  <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">Call Started!</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your phone should be ringing. Please answer to speak with our AI assistant.
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
                  disabled={isLoading}
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

export default SimpleCallMeButton;