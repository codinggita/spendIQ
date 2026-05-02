import React, { useState, useRef, useEffect } from 'react';
import SEO from '../components/SEO';

const SUGGESTIONS = [
  "Summarize my spending this month",
  "Which category did I overspend on?",
  "How can I reduce my expenses?",
  "Show me my top 5 subscriptions"
];

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    const timeNow = new Date().getTime();
    const newMsg = { id: timeNow, text, sender: 'user', timestamp: new Date() };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const botMsg = { 
        id: timeNow + 1, 
        text: `I'm a demo AI assistant. You asked: "${text}". In a real app, I would connect to an LLM API to analyze your financial data and give you actionable insights!`, 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="flex-grow pb-xl h-[calc(100vh-80px)] flex flex-col">
      <SEO 
        title="AI Assistant" 
        description="Interact with SpendIQ AI to get smart financial insights, spending summaries, and budget optimization tips." 
      />
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md shrink-0">
            <div>
                <h1 className="font-headline-xl text-headline-xl text-on-background">AI Financial Assistant</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">Chat with your smart financial advisor.</p>
            </div>
        </header>

        {/* Chat Canvas */}
        <div className="flex-1 clay-card rounded-xl flex flex-col overflow-hidden border border-surface-variant/50">
            {/* Chat Header */}
            <div className="px-lg py-md border-b border-surface-variant/30 bg-surface/50 flex items-center gap-4 shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]">
                    <span className="material-symbols-outlined text-[24px]">smart_toy</span>
                </div>
                <div>
                    <h2 className="font-headline-md text-body-lg font-semibold text-on-surface">SpendIQ AI</h2>
                    <p className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_theme(colors.primary)]"></span> Online
                    </p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-lg bg-surface-container-lowest/30">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-xl">
                    <div className="w-20 h-20 bg-surface-container rounded-2xl shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_rgba(0,0,0,0.05),4px_4px_8px_rgba(0,0,0,0.05)] flex items-center justify-center text-primary mb-lg">
                        <span className="material-symbols-outlined text-[40px]">auto_awesome</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">How can I help you today?</h3>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
                        I can analyze your spending patterns, suggest budget optimizations, or answer questions about your transactions.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        {SUGGESTIONS.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSend(suggestion)}
                            className="p-4 text-left font-body-md text-body-md text-on-surface-variant bg-surface-container-lowest rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.05),-4px_-4px_8px_#ffffff,inset_1px_1px_2px_#ffffff] hover:text-primary hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_#ffffff] transition-all duration-300"
                        >
                            "{suggestion}"
                        </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.1)] ${msg.sender === 'user' ? 'bg-surface-variant text-on-surface-variant' : 'bg-primary-container text-on-primary-container'}`}>
                                <span className="material-symbols-outlined text-[20px]">{msg.sender === 'user' ? 'person' : 'smart_toy'}</span>
                            </div>
                            
                            <div className={`px-5 py-4 rounded-[24px] shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_#ffffff] ${
                                msg.sender === 'user' 
                                ? 'bg-primary text-on-primary rounded-tr-sm shadow-[inset_2px_2px_4px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]' 
                                : 'bg-surface-container-lowest text-on-surface rounded-tl-sm border border-white/50'
                            }`}>
                                <p className="font-body-md text-body-md leading-relaxed">{msg.text}</p>
                                <span className={`text-[10px] mt-2 block font-label-sm ${msg.sender === 'user' ? 'text-primary-fixed-dim' : 'text-outline'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
                </div>
            )}
            </div>

            {/* Chat Input */}
            <div className="p-md bg-surface/80 backdrop-blur-sm border-t border-surface-variant/30 shrink-0">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                    className="flex items-center gap-3 relative max-w-4xl mx-auto"
                >
                    <button 
                        type="button" 
                        className="absolute left-4 p-2 text-outline hover:text-primary transition-colors flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-[24px]">attach_file</span>
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="clay-input-recessed w-full pl-14 pr-16 py-4 rounded-full font-body-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/50 bg-surface-container border-none"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-2 w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center clay-btn-primary disabled:opacity-50 disabled:shadow-none transition-all duration-300"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default AIAssistant;
