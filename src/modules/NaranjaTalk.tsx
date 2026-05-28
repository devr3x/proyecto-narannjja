import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Trash2, Home, Coffee, Sun, Moon, Heart, Star, Cloud, Music, Smile, Zap, MessageSquare, Undo } from 'lucide-react';
import { speakText } from '../utils/speechService';
import '../index.css';

interface Pictogram {
  id: string;
  word: string;
  icon: React.ReactNode;
  color: string;
}

const PICTOGRAMS: Pictogram[] = [
  { id: '1', word: 'Yo', icon: <Smile size={48} strokeWidth={1.5} />, color: '#f43f5e' },
  { id: '2', word: 'Quiero', icon: <Heart size={48} strokeWidth={1.5} />, color: '#ec4899' },
  { id: '3', word: 'Beber', icon: <Coffee size={48} strokeWidth={1.5} />, color: '#d946ef' },
  { id: '4', word: 'Casa', icon: <Home size={48} strokeWidth={1.5} />, color: '#8b5cf6' },
  { id: '5', word: 'Jugar', icon: <Star size={48} strokeWidth={1.5} />, color: '#6366f1' },
  { id: '6', word: 'Música', icon: <Music size={48} strokeWidth={1.5} />, color: '#3b82f6' },
  { id: '7', word: 'Dormir', icon: <Moon size={48} strokeWidth={1.5} />, color: '#0ea5e9' },
  { id: '8', word: 'Día', icon: <Sun size={48} strokeWidth={1.5} />, color: '#eab308' },
  { id: '9', word: 'Rápido', icon: <Zap size={48} strokeWidth={1.5} />, color: '#f97316' },
  { id: '10', word: 'Cielo', icon: <Cloud size={48} strokeWidth={1.5} />, color: '#06b6d4' },
];

export default function NaranjaTalk() {
  const [sentence, setSentence] = useState<string[]>([]);

  const speak = (textToSpeak: string) => {
    speakText(textToSpeak, true);
  };

  const handlePictoClick = (word: string) => {
    setSentence(prev => [...prev, word]);
    speak(word);
  };

  const speakSentence = () => {
    if (sentence.length > 0) {
      speak(sentence.join(' '));
    }
  };

  const clearSentence = () => {
    setSentence([]);
  };

  const removeLast = () => {
    setSentence(prev => prev.slice(0, -1));
  };

  return (
    <div className="module-page animate-fade-in">
      <header className="module-header">
        <Link to="/" className="btn-back glass-panel">
          <ArrowLeft size={24} />
          <span>Volver</span>
        </Link>
        <h2 className="text-gradient">NaranjaTalk</h2>
        <div style={{ flex: 1 }}></div>
      </header>

      <div className="module-body" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.5' }}>
            Un <strong>comunicador dinámico basado en pictogramas</strong> (alternativa moderna a Plaphoons). Toca las imágenes para construir frases. El sistema pronunciará en voz alta cada palabra que añadas y la frase completa al terminar, facilitando la comunicación a usuarios con trastornos motores o del habla.
          </p>
        </div>

        {/* Sentence Display Area */}
        <div className="glass-panel delay-100 animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '180px', border: '1px solid rgba(255, 126, 95, 0.4)', boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 2px 20px rgba(255, 126, 95, 0.05)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', flex: 1, alignItems: 'center', fontSize: '2.5rem', fontWeight: 600 }}>
            {sentence.length === 0 ? (
              <span style={{ color: 'var(--text-muted)', fontSize: '1.5rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={24} /> Pulsa los botones de abajo para formar una frase...
              </span>
            ) : (
              sentence.map((word, idx) => (
                <span key={idx} className="glass-panel" style={{ padding: '0.5rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50px', boxShadow: '0 4px 15px rgba(255, 126, 95, 0.3)' }}>
                  {word}
                </span>
              ))
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={removeLast} disabled={sentence.length === 0} style={{ borderRadius: '50px' }}>
              <Undo size={20} /> Deshacer
            </button>
            <button className="btn-secondary" onClick={clearSentence} disabled={sentence.length === 0} style={{ borderRadius: '50px', color: sentence.length > 0 ? '#f43f5e' : 'inherit' }}>
              <Trash2 size={20} /> Borrar Todo
            </button>
            <button className="btn-primary" onClick={speakSentence} disabled={sentence.length === 0} style={{ borderRadius: '50px', padding: '0.5rem 2rem' }}>
              <Play size={20} fill="currentColor" /> Leer Frase Completa
            </button>
          </div>
        </div>

        {/* Pictogram Grid */}
        <div className="delay-200 animate-fade-in" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '1.5rem',
          flex: 1,
          alignContent: 'start',
          overflowY: 'auto',
          padding: '1rem 0 3rem 0'
        }}>
          {PICTOGRAMS.map((picto) => (
            <button 
              key={picto.id}
              className="glass-panel module-card"
              style={{ 
                padding: '2rem 1rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '1.5rem', 
                border: `2px solid transparent`,
                background: `linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => handlePictoClick(picto.word)}
              onMouseOver={(e) => {
                e.currentTarget.style.border = `2px solid ${picto.color}`;
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 15px 30px ${picto.color}30`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.border = `2px solid transparent`;
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
              }}
            >
              <div style={{ 
                color: 'white', 
                background: picto.color, 
                padding: '1.5rem', 
                borderRadius: '50%',
                boxShadow: `0 4px 20px ${picto.color}80`
              }}>
                {picto.icon}
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.5px' }}>{picto.word}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
