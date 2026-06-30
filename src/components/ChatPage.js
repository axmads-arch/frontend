import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../data/api';

export default function ChatPage({ user, onClose, onAuthRequired }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const r = await fetch(`${API_URL}/chat/${user.phone}`);
      const d = await r.json();
      setMessages(Array.isArray(d) ? d : []);
    } catch (e) {}
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerPhone: user.phone, customerName: user.name, message: input.trim(), fromAdmin: false }),
      });
      setInput('');
      loadMessages();
    } catch (e) {}
    setSending(false);
  };

  if (!user) {
    return (
      <div className="search-overlay">
        <div className="search-header">
          <span style={{ flex: 1, fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>💬 Chat</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Yopish</button>
        </div>
        <div className="empty-state" style={{ marginTop: 40 }}>
          <div className="empty-state-icon">💬</div>
          <h3>Chat uchun kiring</h3>
          <p>Admin bilan bog'lanish uchun tizimga kiring</p>
          <button className="login-btn" style={{ marginTop: 20 }} onClick={onAuthRequired}>Kirish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="search-overlay" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <div className="search-header" style={{ padding: 16, margin: 0, background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👨‍🍳</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Rahmat Chef</div>
            <div style={{ fontSize: 11, color: 'var(--teal)' }}>Onlayn yordam</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Yopish</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text3)', marginTop: 40 }}>Yuklanmoqda...</div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>Suhbat boshlanmagan</h3>
            <p>Savolingizni yozing, tez orada javob beramiz</p>
          </div>
        ) : (
          messages.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: m.fromAdmin ? 'flex-start' : 'flex-end' }}>
              <div style={{
                maxWidth: '75%', padding: '10px 14px', borderRadius: m.fromAdmin ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                background: m.fromAdmin ? 'var(--white)' : 'var(--teal)',
                color: m.fromAdmin ? 'var(--text)' : '#fff',
                boxShadow: 'var(--shadow)', fontSize: 14, lineHeight: 1.4
              }}>
                {m.message}
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
                  {new Date(m.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: 12, background: 'var(--white)', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <input
          className="field-input"
          style={{ flex: 1 }}
          placeholder="Xabar yozing..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          style={{ background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 12, width: 44, height: 44, fontSize: 18, cursor: 'pointer', flexShrink: 0 }}
        >➤</button>
      </div>
    </div>
  );
}
