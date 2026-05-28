import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mic, Square, Volume2 } from 'lucide-react';
import '../index.css';

export default function NaranjaVoice() {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>(0);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;
      
      setIsListening(true);
      setError('');
      updateVolume();
    } catch (err) {
      console.error('Error al acceder al micrófono', err);
      setError('No se pudo acceder al micrófono. Por favor, dale permisos.');
    }
  };

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setVolume(0);
  };

  const updateVolume = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calcular el volumen medio
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    let average = sum / dataArray.length;
    
    // Normalizar a porcentaje (aprox max es 100)
    let percent = Math.min(100, Math.max(0, average * 1.5));
    
    setVolume(percent);
    animationFrameRef.current = requestAnimationFrame(updateVolume);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  // Calcular color basado en volumen
  const getVolumeColor = () => {
    if (volume < 30) return '#4ade80'; // Verde
    if (volume < 70) return '#eab308'; // Amarillo
    return '#f43f5e'; // Rojo
  };

  return (
    <div className="module-page animate-fade-in">
      <header className="module-header">
        <Link to="/" className="btn-back glass-panel">
          <ArrowLeft size={24} />
          <span>Volver</span>
        </Link>
        <h2 className="text-gradient">NaranjaVoice</h2>
        <div style={{ flex: 1 }}></div>
      </header>

      <div className="module-body delay-100 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3rem', height: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h3>Entrenamiento de Intensidad Vocal</h3>
          <p style={{ color: 'var(--text-muted)' }}>Habla por el micrófono para ver la intensidad de tu voz. Ideal para ejercicios de logopedia, aprender a controlar el volumen y la duración del habla.</p>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {/* Visualizer */}
        <div className="delay-200 animate-fade-in" style={{ 
          position: 'relative', 
          width: '300px', 
          height: '300px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {/* Circulo de fondo animado */}
          <div style={{
            position: 'absolute',
            width: `${Math.max(50, volume * 3)}px`,
            height: `${Math.max(50, volume * 3)}px`,
            borderRadius: '50%',
            background: getVolumeColor(),
            opacity: 0.3,
            transition: 'width 0.1s ease-out, height 0.1s ease-out, background 0.3s ease',
          }}></div>
          
          {/* Circulo central fijo */}
          <div className="glass-panel" style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            border: `4px solid ${getVolumeColor()}`,
            transition: 'border-color 0.3s ease'
          }}>
            <Volume2 size={48} color={getVolumeColor()} style={{ transition: 'color 0.3s ease' }} />
          </div>
        </div>

        {/* Controls */}
        <div className="delay-300 animate-fade-in">
          {!isListening ? (
            <button className="btn-primary" onClick={startListening} style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '50px' }}>
              <Mic size={24} /> Empezar a Escuchar
            </button>
          ) : (
            <button className="btn-secondary" onClick={stopListening} style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '50px', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', border: '1px solid #f43f5e' }}>
              <Square size={24} fill="currentColor" /> Detener
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
