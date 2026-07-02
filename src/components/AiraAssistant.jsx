import { memo, useState, useEffect, useRef } from 'react';
import logo from '../assets/logo1.png';

const QUICK_PROMPTS = [
  { text: '🌟 Apa itu Kabinet Perkasa?', type: 'kabinet' },
  { text: '👥 Siapa saja pengurus intinya?', type: 'bph' },
  { text: '💻 Ada divisi apa saja?', type: 'divisi' },
  { text: '📍 Lokasi & Kontak HIMA TI', type: 'kontak' },
];

const BOT_RESPONSES = {
  kabinet: 'Kabinet Perkasa adalah nama kabinet HIMA TI FKOM UNIKU periode ini. Dengan tagline "Bersama Membangun, Berdampak Nyata", kami berkomitmen menjadi wadah kolaborasi, inovasi, dan peningkatan kompetensi mahasiswa Teknik Informatika.',
  bph: 'Badan Pengurus Harian (BPH) Kabinet Perkasa dipimpin oleh:\n• Ketua: Romi Ahmad Al-Malik\n• Wakil Ketua: Muhammad Raihan Dhenda\n• Sekretaris I & II: Nayla Nur Alvi & Muhammad Haqil Abdillah\n• Bendahara I & II: Yeyen Ai Nurhidayati & Salwa Hamdunah',
  divisi: 'HIMA TI memiliki 7 divisi kerja:\n1. 📢 Organisasi (Humas & Relasi)\n2. 🧪 Litbang (Riset & Kajian IT)\n3. 💡 Iptek (Workshop & Proyek Inovatif)\n4. 💼 Bismit (Bisnis & Kewirausahaan)\n5. ⚽ Olahraga (Kebugaran & Turnamen)\n6. 🎨 Medinfo (Publikasi & Desain Kreatif)\n7. 🕌 Kerohanian (Binaan Spiritual)',
  kontak: 'Sekretariat HIMA TI berlokasi di Kampus 2 UNIKU, Jl. Pramuka No. 67, Purwawinangun, Kuningan.\n✉️ Email: hima.ti@uniku.ac.id\n📱 Instagram: @hima.ti.uniku',
};

const AiraAssistant = memo(function AiraAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Halo! Saya Aira, asisten virtual HIMA TI. Ada yang bisa saya bantu? Silakan pilih topik di bawah ini atau kirim pesan!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handlePromptClick = (prompt) => {
    // Add user message
    const userMsg = {
      sender: 'user',
      text: prompt.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const replyText = BOT_RESPONSES[prompt.type] || 'Ada yang bisa saya bantu lainnya?';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 900);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    const userMsg = {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      // Basic text matcher
      const query = userText.toLowerCase();
      let replyText = 'Maaf, saya tidak mengerti. Silakan gunakan tombol pertanyaan cepat di bawah untuk informasi lebih lengkap!';
      
      if (query.includes('kabinet') || query.includes('perkasa') || query.includes('tagline')) {
        replyText = BOT_RESPONSES.kabinet;
      } else if (query.includes('pengurus') || query.includes('ketua') || query.includes('bph') || query.includes('romi') || query.includes('yeyen')) {
        replyText = BOT_RESPONSES.bph;
      } else if (query.includes('divisi') || query.includes('iptek') || query.includes('organisasi') || query.includes('litbang')) {
        replyText = BOT_RESPONSES.divisi;
      } else if (query.includes('kontak') || query.includes('lokasi') || query.includes('alamat') || query.includes('email')) {
        replyText = BOT_RESPONSES.kontak;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[99] w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 rounded-full flex items-center justify-center shadow-[0_8px_32px_0_rgba(16,185,129,0.3)] hover:shadow-[0_8px_32px_0_rgba(16,185,129,0.5)] border border-emerald-500/20 text-white cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none"
        aria-label="Tanya Aira Assistant"
      >
        {isOpen ? (
          <svg className="w-6 h-6 transition-transform duration-300 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Pulsating ring */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/30 animate-ping duration-1000" />
            <svg className="w-7 h-7 text-white drop-shadow-md group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-[99] w-[calc(100vw-32px)] sm:w-96 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.2)] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{ height: '500px', maxHeight: '75vh' }}
      >
        {/* Header */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-green-700 via-green-800 to-emerald-900 text-white flex items-center gap-3 shadow-md shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-500" />
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0">
            <img src={logo} alt="Aira" className="w-full h-full object-contain animate-bounce" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">Aira Assistant</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-green-200 font-semibold tracking-wider uppercase">Online</span>
            </div>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/10 to-green-50/10">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-green-700 to-emerald-800 text-white rounded-tr-none'
                    : 'bg-white/95 text-green-950 border border-green-100/50 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-neutral-400/80 mt-1 px-1 font-medium">{msg.time}</span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex flex-col items-start">
              <div className="bg-white/95 border border-green-100/50 px-4 py-3.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-green-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-green-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Container */}
        {messages.length < 5 && (
          <div className="px-4 py-2 border-t border-green-100/30 flex flex-wrap gap-2 bg-white/20 shrink-0">
            {QUICK_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="text-xs font-semibold text-green-800 bg-white/90 hover:bg-green-50 border border-green-100 px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {prompt.text}
              </button>
            ))}
          </div>
        )}

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 border-t border-green-100/30 bg-white/60 backdrop-blur-md flex gap-2 shrink-0">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Tulis pesan Anda..."
            className="flex-1 px-4 py-2.5 bg-white border border-green-100 rounded-2xl text-sm text-green-950 placeholder-green-800/40 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/40 transition-all"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5 transform rotate-90 translate-x-[-1px] translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
})

export default AiraAssistant