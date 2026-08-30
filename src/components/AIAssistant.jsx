import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle } from "lucide-react";

export default function AIAssistant({ kpiData, salesData, trafficData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I am your Anal Buddy AI assistant. Ask me questions about your revenue, sales performance, or traffic channels! 🚀",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getAIResponse = (query) => {
    const q = query.toLowerCase();
    
    // Read current state from props to provide REAL data replies
    const revenue = kpiData?.[0]?.value || "$128,430";
    const revenueChange = kpiData?.[0]?.change || "+12.5%";
    const activeUsers = kpiData?.[1]?.value || "24,812";
    const convRate = kpiData?.[2]?.value || "3.64%";
    const sessionTime = kpiData?.[3]?.value || "4m 32s";

    if (q.includes("revenue") || q.includes("earnings") || q.includes("profit")) {
      return `Your total revenue is currently **${revenue}**, which is up by **${revenueChange}** vs the previous period. The monthly trend demonstrates Week 4 as our strongest performance period.`;
    }
    
    if (q.includes("user") || q.includes("active") || q.includes("visitors")) {
      return `We currently have **${activeUsers}** active users on the platform. Mobile devices account for roughly 38% of our user traffic sharing ratio.`;
    }

    if (q.includes("conversion") || q.includes("rate") || q.includes("conv")) {
      return `Our platform Conversion Rate is **${convRate}** (down -0.4% from target). To increase conversion, we recommend checking checkout funnel exit logs for Clothing and Books.`;
    }

    if (q.includes("sales") || q.includes("category") || q.includes("target")) {
      return `Here is a category summary:
- **Electronics**: $42k (Target: $45k)
- **Clothing**: $28k (Target: $30k)
- **Books**: $15k (Target: $18k)
- **Home & Garden**: $22k (Target: $20k - Target Exceeded! 🎉)
Overall, total actual sales achieved represent ~93.2% of target parameters.`;
    }

    if (q.includes("traffic") || q.includes("source") || q.includes("organic") || q.includes("social")) {
      return `Traffic channels:
- **Organic Search**: 38% (Primary driver)
- **Direct Visits**: 22%
- **Social Media**: 18%
- **Email campaigns**: 12%
- **Referrals**: 10%
Organic search has experienced a 4% growth following our SEO updates last month.`;
    }

    if (q.includes("session") || q.includes("average") || q.includes("time")) {
      return `Average Session Duration is **${sessionTime}** (up +1.1%). This indicates steady retention, likely influenced by the improvements in site performance scores.`;
    }

    return "I am Anal Buddy AI. I couldn't quite find details for that query. You can ask me things like: 'Summarize revenue trend', 'What is our conversion rate?', 'Show sales by category', or 'How many active users do we have?'.";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    
    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    
    setIsTyping(true);
    // Simulate AI thinking time
    await new Promise((r) => setTimeout(r, 1000));
    setIsTyping(false);

    const reply = getAIResponse(userText);
    setMessages((prev) => [...prev, { sender: "ai", text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all scale-100 hover:scale-105"
        >
          <MessageSquare size={24} />
          <span className="absolute -top-1.5 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-slate-50 dark:border-slate-900 rounded-full"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-[320px] sm:w-[360px] h-[450px] shadow-2xl flex flex-col overflow-hidden transition-colors">
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <h4 className="text-sm font-bold">Anal Buddy AI</h4>
                <p className="text-[10px] text-blue-200">Online & ready</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          {/* Quick recommendations */}
          <div className="bg-slate-50 dark:bg-slate-900/40 px-3 py-2 border-b border-slate-100 dark:border-slate-700 flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              "Summarize revenue",
              "Conversion rate",
              "Sales review",
              "Traffic sources",
            ].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setInput(p);
                }}
                className="text-[10px] whitespace-nowrap bg-white dark:bg-slate-755 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 px-2 py-1 rounded-full hover:bg-slate-50 transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-55 dark:bg-slate-800/60 no-scrollbar">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-slate-105 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700 rounded-tl-none"
                }`}>
                  {m.text.split("\n").map((line, lIdx) => {
                    const parts = line.split("**");
                    return (
                      <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>
                        {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold">{p}</strong> : p)}
                      </p>
                    );
                  })}
                  <span className={`block text-[9px] mt-1 text-right ${m.sender === "user" ? "text-blue-200" : "text-slate-455"}`}>{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-750 text-slate-500 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Anal Buddy AI..."
              className="flex-1 px-3 py-2 text-xs bg-slate-55 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-850 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}