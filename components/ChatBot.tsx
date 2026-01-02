
import React, { useState, useRef, useEffect } from 'react';
import { getArchitecturalResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Dialogue architectural ouvert. Comment puis-je assister votre réflexion aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    const response = await getArchitecturalResponse(userMsg);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsTyping(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 right-10 z-50 w-20 h-20 bg-black text-pistachio rounded-none border-[3px] border-black shadow-[10px_10px_0px_0px_#93c572] flex items-center justify-center hover:bg-pistachio hover:text-black transition-all duration-300"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-terminal'} text-2xl`}></i>
      </button>

      {isOpen && (
        <div className="fixed bottom-36 right-10 z-50 w-[95vw] md:w-[450px] h-[600px] bg-white rounded-none border-[4px] border-black shadow-[20px_20px_0px_0px_#93c572] flex flex-col overflow-hidden animate-in zoom-in duration-300">
          <div className="bg-black text-white px-8 py-6 flex items-center justify-between border-b-[4px] border-pistachio">
            <div>
              <h3 className="font-bold tracking-tighter text-xl serif italic">YZ_ASSISTANT</h3>
              <p className="text-[10px] text-pistachio uppercase tracking-[0.5em] font-bold">Protocol Gemini</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-6 py-4 border-[2px] border-black text-sm font-light leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-black text-white' 
                    : 'bg-pistachio-soft/50 text-black shadow-[6px_6px_0px_0px_#93c572]'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-pistachio-soft px-4 py-2 border-2 border-black flex space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t-[4px] border-black bg-white">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Entrer commande..."
                className="flex-1 bg-pistachio-soft/20 border-[3px] border-black/5 px-6 py-4 text-sm font-bold focus:outline-none focus:border-black transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-14 h-14 bg-black text-pistachio flex items-center justify-center disabled:opacity-20 hover:bg-pistachio hover:text-black transition-all"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;