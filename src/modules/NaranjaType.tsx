import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Delete, Play } from 'lucide-react';
import '../index.css';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.']
];

export default function NaranjaType() {
  const [text, setText] = useState('');
  const [predictions, setPredictions] = useState(['Hola', 'Quiero', 'Gracias', 'Por favor', 'Sí']);

  const handleKey = (key: string) => {
    setText(prev => prev + key.toLowerCase());
    // Simulate updating predictions based on input
    if (key === 'H') setPredictions(['Hola', 'Hambre', 'Hacer', 'Hoyo', 'Hoy']);
    else if (key === 'Q') setPredictions(['Quiero', 'Qué', 'Quién', 'Queso', 'Quedar']);
  };

  const handlePrediction = (word: string) => {
    const words = text.trim().split(' ');
    words.pop(); // Remove current partial word
    const newText = words.length > 0 ? words.join(' ') + ' ' + word + ' ' : word + ' ';
    setText(newText);
    setPredictions(['Y', 'No', 'Pero', 'Porque', 'También']);
  };

  const speakSentence = () => {
    if (text) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="module-page animate-fade-in">
      <header className="module-header">
        <Link to="/" className="btn-back glass-panel">
          <ArrowLeft size={24} />
          <span>Volver</span>
        </Link>
        <h2 className="text-gradient">NaranjaType</h2>
        <div style={{ flex: 1 }}></div>
      </header>

      <div className="module-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            <strong>Un teclado inteligente en pantalla (Teclado Mágico).</strong> Está diseñado para escribirse letra a letra mediante ratón o escaneo automático. Incluye un sistema de predicción de palabras en la parte superior para acelerar enormemente la comunicación y reducir el esfuerzo motor necesario para formar frases completas.
          </p>
        </div>

        {/* Display Area */}
        <div className="glass-panel delay-100 animate-fade-in" style={{ padding: '2.5rem', fontSize: '2.5rem', minHeight: '140px', display: 'flex', alignItems: 'center', background: 'rgba(20, 24, 32, 0.8)', boxShadow: 'inset 0 5px 20px rgba(0,0,0,0.5)' }}>
          {text || <span style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>Escribe mediante el teclado en pantalla...</span>}
          <span className="cursor-blink" style={{ borderRight: '3px solid var(--primary)', height: '2.5rem', marginLeft: '5px' }}></span>
        </div>

        {/* Predictions */}
        <div className="delay-200 animate-fade-in" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '0.5rem 0' }}>
          {predictions.map(word => (
            <button 
              key={word} 
              className="btn-secondary" 
              style={{ flexShrink: 0, padding: '1rem 2rem', fontSize: '1.2rem', background: 'rgba(255,126,95,0.1)', color: 'var(--primary)', borderColor: 'var(--primary)', borderRadius: '12px' }}
              onClick={() => handlePrediction(word)}
            >
              {word}
            </button>
          ))}
        </div>

        {/* Keyboard */}
        <div className="glass-panel delay-300 animate-fade-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.02)' }}>
          {KEYBOARD_ROWS.map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {row.map(key => (
                <button 
                  key={key} 
                  className="keyboard-key"
                  style={{ width: '65px', height: '65px', fontSize: '1.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  onClick={() => handleKey(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="keyboard-key" style={{ width: '135px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => setText(prev => prev.slice(0, -1))}>
              <Delete size={28} />
            </button>
            <button className="keyboard-key" style={{ flex: 1, maxWidth: '450px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '2px' }} onClick={() => setText(prev => prev + ' ')}>
              ESPACIO
            </button>
            <button className="btn-primary" style={{ width: '135px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '12px' }} onClick={speakSentence}>
              <Play size={28} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
