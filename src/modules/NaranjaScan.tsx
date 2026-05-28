import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MousePointerClick, Save, Clock, Palette } from 'lucide-react';
import '../index.css';

export default function NaranjaScan() {
  const [speed, setSpeed] = useState(1500);
  const [color, setColor] = useState('#f43f5e');

  return (
    <div className="module-page animate-fade-in">
      <header className="module-header">
        <Link to="/" className="btn-back glass-panel">
          <ArrowLeft size={24} />
          <span>Volver</span>
        </Link>
        <h2 className="text-gradient">NaranjaScan</h2>
        <div style={{ flex: 1 }}></div>
      </header>

      <div className="module-body" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-panel delay-100 animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <MousePointerClick size={48} color="#60a5fa" style={{ marginBottom: '1rem' }} />
          <h3>Configuración de Barrido Automático</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: '1.6' }}>
            <strong>NaranjaScan es una herramienta inspirada en Kanghooru.</strong> Permite configurar el "escaneo automático" que recorre todos los botones de la pantalla uno por uno. Está diseñado específicamente para personas con movilidad reducida que utilizan un único conmutador (como pulsar la barra espaciadora o un pulsador externo adaptado) para interactuar con todo el sistema sin necesidad de ratón.
          </p>
        </div>

        <div className="glass-panel delay-200 animate-fade-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Clock size={24} color="var(--primary)" />
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Velocidad de Escaneo (ms)</label>
              <input type="range" min="500" max="4000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: '100%' }} />
              <div style={{ textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{speed} milisegundos</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Palette size={24} color="var(--primary)" />
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Color del Resaltado</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['#f43f5e', '#3b82f6', '#4ade80', '#eab308', '#a855f7'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', background: c, 
                      border: color === c ? '3px solid white' : 'none',
                      boxShadow: color === c ? `0 0 10px ${c}` : 'none',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="delay-300 animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn-primary" onClick={() => alert('Configuración guardada (Simulación)')}>
              <Save size={20} /> Guardar Ajustes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
