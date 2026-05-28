import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Type, Volume2, Settings2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NaranjaSpace() {
  const [text, setText] = useState('');
  const textRef = useRef('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  // Referencia para evitar el bug de Garbage Collection en Chrome/Edge que corta el audio
  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSpokenIndexRef = useRef<number>(0);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      // Mostrar TODAS las voces en español disponibles en el sistema
      let availableVoices = window.speechSynthesis.getVoices().filter(v => 
        v.lang.startsWith('es')
      );
      
      // Priorizar voces Microsoft (offline en Windows) y luego otras
      availableVoices = availableVoices.sort((a, b) => {
        const aScore = (a.name.includes('Microsoft') ? 2 : 0) 
          + (a.name.includes('Online') || a.name.includes('Google') || a.name.includes('Natural') || a.name.includes('Premium') ? 1 : 0);
        const bScore = (b.name.includes('Microsoft') ? 2 : 0) 
          + (b.name.includes('Online') || b.name.includes('Google') || b.name.includes('Natural') || b.name.includes('Premium') ? 1 : 0);
        return bScore - aScore;
      });

      setVoices(availableVoices);
      
      // Buscar la mejor voz por defecto
      const defaultVoice = availableVoices.find(v => v.name.includes('Alvaro') || v.name.includes('Álvaro'))
        || availableVoices.find(v => v.name.includes('Microsoft'))
        || availableVoices.find(v => v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Natural')) 
        || availableVoices[0];
        
      if (defaultVoice) setSelectedVoice(defaultVoice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (textToSpeak: string, isSingleLetter: boolean = false) => {
    if (!textToSpeak.trim()) return;
    
    // Diccionario fonético estándar con acentos para evitar que las voces neuronales lo deletreen (ej. C-U)
    const letterNames: Record<string, string> = {
      'a': 'á', 'b': 'be', 'c': 'ce', 'd': 'de', 'e': 'é', 'f': 'efe', 'g': 'ge',
      'h': 'hache', 'i': 'í', 'j': 'jota', 'k': 'ca', 'l': 'ele', 'm': 'eme',
      'n': 'ene', 'ñ': 'eñe', 'o': 'ó', 'p': 'pe', 'q': 'cú', 'r': 'erre',
      's': 'ese', 't': 'te', 'u': 'ú', 'v': 'uve', 'w': 'uve doble', 'x': 'equis',
      'y': 'i griega', 'z': 'ceta'
    };

    let finalString = textToSpeak;
    
    if (isSingleLetter) {
      const lowerChar = textToSpeak.toLowerCase();
      if (letterNames[lowerChar]) {
        // Le añadimos un punto para que entone hacia abajo y no suene cortado
        finalString = letterNames[lowerChar] + '.';
      } else {
        finalString = textToSpeak + '.';
      }
    }
    
    const utterance = new SpeechSynthesisUtterance(finalString);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang; // Crucial para que voces específicas como Tristán no fallen
    }
    // No modificamos el rate para voces online porque a veces causa cortes (clipping)
    utterance.rate = 1.0; 
    utterance.pitch = 1.0;
    
    // Guardamos la referencia para evitar que el navegador la borre (GC bug)
    utterancesRef.current.push(utterance);
    utterance.onend = () => {
      utterancesRef.current = utterancesRef.current.filter(u => u !== utterance);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // textRef.current tiene el texto exacto justo antes de pulsar esta tecla
    const currentText = textRef.current;

    if (e.key === ' ' || e.code === 'Space') {
      window.speechSynthesis.cancel();
      const words = currentText.trim().split(/\s+/);
      const lastWord = words[words.length - 1];
      
      if (lastWord) {
        // Un pequeño retraso evita que el cancel() bloquee el siguiente speak() en Chrome/Edge
        setTimeout(() => speak(lastWord), 50);
      }
    } else if (e.key === 'Enter') {
      window.speechSynthesis.cancel();
      const lines = currentText.split('\n');
      const lastLine = lines[lines.length - 1];
      if (lastLine) {
        setTimeout(() => speak(lastLine), 50);
      }
    } else if (e.key.length === 1) {
      window.speechSynthesis.cancel();
      setTimeout(() => speak(e.key, true), 50);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    textRef.current = e.target.value;
  };

  const handleClear = () => {
    setText('');
    lastSpokenIndexRef.current = 0;
    window.speechSynthesis.cancel();
  };

  return (
    <div className="module-page animate-fade-in" style={{ height: '100vh', padding: '0 2rem' }}>
      <header className="module-header" style={{ paddingTop: '2rem' }}>
        <Link to="/" className="btn-back glass-panel">
          <ArrowLeft size={24} />
          <span>Volver al Inicio</span>
        </Link>
        <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Type size={32} color="#f43f5e" /> Matrakes Naranja
        </h2>
        <div className="header-actions">
          <button className="btn-icon" onClick={() => speak(text)} title="Leer todo el texto">
            <Volume2 size={24} />
          </button>
          <button className="btn-icon" onClick={handleClear} title="Borrar todo">
            <Trash2 size={24} color="#f87171" />
          </button>
        </div>
      </header>

      <div className="module-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0 2rem 0' }}>
        <div className="glass-panel delay-100 animate-fade-in" style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', padding: '2rem', position: 'relative', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
          <textarea
            ref={textareaRef}
            className="matrakes-textarea"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe aquí... (Presiona Espacio para leer la palabra, y Enter para leer la frase)"
            autoFocus
            style={{
              flex: 1,
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '3rem',
              fontFamily: 'inherit',
              fontWeight: 500,
              resize: 'none',
              outline: 'none',
              lineHeight: '1.4'
            }}
          />
        </div>
        
        {/* Settings Bar */}
        <div className="glass-panel delay-200 animate-fade-in" style={{ width: '100%', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Settings2 size={24} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-muted)' }}>Voz:</span>
          <select 
            value={selectedVoice?.name || ''} 
            onChange={(e) => {
              const voice = voices.find(v => v.name === e.target.value);
              if (voice) setSelectedVoice(voice);
            }}
            style={{
              background: 'var(--bg-dark)',
              color: 'white',
              border: '1px solid var(--glass-border)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontFamily: 'inherit',
              fontSize: '1rem',
              cursor: 'pointer',
              flex: 1,
              maxWidth: '300px'
            }}
          >
            {voices.map(voice => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
