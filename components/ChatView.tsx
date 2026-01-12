import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { Send, Image as ImageIcon, Loader2, Bot, User, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

export const ChatView: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageMime, setSelectedImageMime] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClear = () => {
    setMessages([]);
    setInput('');
    setSelectedImage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        const mime = base64String.split(';')[0].split(':')[1];
        setSelectedImageMime(mime);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const currentImage = selectedImage;
    const currentMime = selectedImageMime;
    setSelectedImage(null);
    setSelectedImageMime(null);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using gemini-3-flash-preview for fast multimodal chat
      const modelId = 'gemini-3-flash-preview';
      
      const contents = [];
      if (currentImage && currentMime) {
        const base64Data = currentImage.split(',')[1];
        contents.push({
          inlineData: {
            mimeType: currentMime,
            data: base64Data
          }
        });
      }
      if (userMsg.text) {
        contents.push({ text: userMsg.text });
      }

      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        isLoading: true
      }]);

      const streamResult = await ai.models.generateContentStream({
        model: modelId,
        contents: { parts: contents }
      });

      let fullText = '';
      
      for await (const chunk of streamResult) {
        const textChunk = (chunk as GenerateContentResponse).text;
        if (textChunk) {
            fullText += textChunk;
            setMessages(prev => prev.map(msg => 
                msg.id === modelMsgId 
                ? { ...msg, text: fullText, isLoading: false } 
                : msg
            ));
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Error generating response. Please try again.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-lg overflow-hidden shadow-xl border border-zinc-800">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-400" />
          Gemini Chat
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">Gemini 3 Flash</span>
        </h2>
        
        {messages.length > 0 && (
            <button 
                onClick={handleClear}
                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Clear Chat"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8" />
            </div>
            <p>Start a conversation with Gemini 3.0</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-zinc-700' : 'bg-blue-600'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            
            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-zinc-700 text-white rounded-tr-none' 
                  : 'bg-zinc-800/80 text-zinc-100 rounded-tl-none border border-zinc-700/50'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="User upload" className="max-w-full rounded-lg mb-2 max-h-64 object-cover" />
                )}
                {msg.isLoading && !msg.text ? (
                   <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown 
                        components={{
                            code: ({node, ...props}) => <code className="bg-black/30 rounded px-1 py-0.5 text-blue-200" {...props} />,
                            pre: ({node, ...props}) => <pre className="bg-black/50 p-3 rounded-lg overflow-x-auto border border-zinc-700/50" {...props} />
                        }}
                    >
                        {msg.text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800">
        {selectedImage && (
          <div className="mb-2 relative inline-block group">
            <img src={selectedImage} alt="Preview" className="h-20 rounded-lg border border-zinc-700" />
            <button 
              onClick={() => { setSelectedImage(null); setSelectedImageMime(null); }}
              className="absolute -top-2 -right-2 bg-zinc-800 text-red-400 border border-zinc-700 rounded-full p-1 hover:bg-zinc-700 transition shadow-lg"
            >
              <div className="w-3 h-3 flex items-center justify-center">×</div>
            </button>
          </div>
        )}
        
        <div className="flex gap-2">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                title="Upload Image"
            >
                <ImageIcon className="w-5 h-5" />
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageSelect}
            />
            
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder="Message Gemini..."
                className="flex-1 bg-zinc-800 border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-[50px] scrollbar-hide"
            />
            
            <button 
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
        </div>
      </div>
    </div>
  );
};