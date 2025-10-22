'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle, Send, X, Bot, Loader2, Paperclip, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

type LangCode = 'en' | 'hi' | 'te' | 'mr';

interface Props {
  embedded?: boolean;
  className?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function AIChatbot({ embedded = false, className = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant for the grievance redressal portal. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [language, setLanguage] = useState<LangCode>('en');
  const [isCalling, setIsCalling] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Nudge the model to respond in the selected language without changing backend
          message: `${text.trim()}\n\nPlease respond in ${languageLabel(language)}.`,
          sessionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      toast.error('Failed to send message');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble processing your request right now. Please try again later or contact support.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const languageLabel = (code: LangCode) => {
    switch (code) {
      case 'hi':
        return 'Hindi';
      case 'te':
        return 'Telugu';
      case 'mr':
        return 'Marathi';
      default:
        return 'English';
    }
  };

  const triggerCall = async () => {
    try {
      setIsCalling(true);
      const res = await fetch('/api/call-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useDefault: true, userInfo: { source: 'ai-chat', sessionId } }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initiate call');
      }
      toast.success('Calling you now…');
    } catch (e: any) {
      toast.error(e?.message || 'Call failed');
    } finally {
      setIsCalling(false);
    }
  };

  const onAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const form = new FormData();
      // Decide type
      const mime = file.type;
      const isImage = mime.startsWith('image/');
      const isVideo = mime.startsWith('video/');
      form.append('file', file);
      form.append('type', isImage ? 'image' : isVideo ? 'video' : 'document');
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      // Show preview message and inform chatbot
      const url = data.url as string;
      const filename = (file.name || url.split('/').pop() || 'attachment');
      const previewText = isImage ? `📷 Attached image: ${filename}\n${url}` : isVideo ? `🎥 Attached video: ${filename}\n${url}` : `📎 Attached file: ${filename}\n${url}`;
      await sendMessage(previewText);
      toast.success('Attachment uploaded');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const quickActions = [
    'How do I file a complaint?',
    'How to track my complaint?',
    'What departments are available?',
    'How long does resolution take?',
    'I need urgent help',
  ];

  const ChatShell = (
    <div className={`bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col ${embedded ? 'h-[70vh] w-full' : 'w-96 h-[520px]'} ${className}`}>
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 sm:p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} className="" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LangCode)}
            className="text-sm text-gray-800 rounded-md px-2 py-1 bg-white border border-blue-300 focus:outline-none focus:ring-1 focus:ring-white"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="te">Telugu</option>
            <option value="mr">Marathi</option>
          </select>
          <button onClick={triggerCall} disabled={isCalling} className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-md px-2.5 py-1.5 disabled:opacity-50">
            <Phone size={16} className="mr-1" /> {isCalling ? 'Calling…' : 'Call'}
          </button>
          {!embedded && (
            <button onClick={() => setIsOpen(false)} className="text-white/90 hover:text-white"><X size={18} /></button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
        {/* Watermark when empty */}
        {messages.length <= 1 && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <Image src="/resolvex-logo.svg" alt="ResolveX" width={160} height={160} className="w-40 h-40" />
          </div>
        )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start">
                    {message.sender === 'bot' && (
                      <Bot size={16} className="mr-2 mt-1 text-blue-600" />
                    )}
                    <div>
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(action)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Bot size={16} className="mr-2 text-blue-600" />
                    <Loader2 size={16} className="animate-spin" />
                    <span className="ml-2 text-sm">Typing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={onAttachClick}
            disabled={uploading}
            className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            title="Attach files"
          >
            <Paperclip size={16} />
          </button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*,.pdf,.doc,.docx,.txt" />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );

  if (embedded) {
    return ChatShell;
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40">
          {ChatShell}
        </div>
      )}
    </>
  );
}
