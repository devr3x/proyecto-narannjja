import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Mic, 
  MousePointerClick, 
  Keyboard, 
  Sun,
  Moon,
  Play,
  Square,
  Settings,
  Type,
  X,
  RefreshCw
} from 'lucide-react';
import NaranjaSpace from './modules/NaranjaSpace';
import NaranjaTalk from './modules/NaranjaTalk';
import NaranjaVoice from './modules/NaranjaVoice';
import NaranjaScan from './modules/NaranjaScan';
import NaranjaType from './modules/NaranjaType';
import './index.css';

const translations: any = {
  es: {
    heroTitle: 'Accesibilidad sin <span class="text-gradient">Límites</span>',
    heroSubtitle: 'La evolución del Proyecto Fressa (creado por Jordi). Una suite de herramientas de software libre, modernas y accesibles directamente desde tu PC.',
    stopScan: 'Detener',
    startScan: 'Escaneo',
    spaceTitle: 'Matrakes Naranja',
    spaceDesc: 'Escribe y escucha. Cada vez que pulses la barra espaciadora, leerá la palabra.',
    talkTitle: 'NaranjaTalk',
    talkDesc: 'Comunicador dinámico avanzado. Crea tableros con pictogramas o texto.',
    voiceTitle: 'NaranjaVoice',
    voiceDesc: 'Herramienta interactiva de logopedia con retroalimentación visual.',
    scanTitle: 'NaranjaScan',
    scanDesc: 'Configura la navegación por barrido para toda la aplicación.',
    typeTitle: 'NaranjaType',
    typeDesc: 'Teclado inteligente en pantalla con predicción de palabras.',
    footer: 'Por Álvaro González Sánchez. Basado en Proyecto Fressa de Jordi.',
    settings: 'Ajustes',
    theme: 'Tema',
    language: 'Idioma',
    light: 'Claro',
    dark: 'Oscuro',
    close: 'Cerrar',
    checkForUpdates: 'Buscar actualizaciones',
    updateAvailable: '¡Actualización disponible! Descargando...',
    updateReady: 'Actualización lista. Haz clic aquí para reiniciar e instalar.',
    noUpdate: 'La aplicación está actualizada.',
    checking: 'Buscando actualizaciones...'
  },
  en: {
    heroTitle: 'Accessibility without <span class="text-gradient">Limits</span>',
    heroSubtitle: 'The evolution of Proyecto Fressa (created by Jordi). A suite of free, modern, and accessible software tools directly from your PC.',
    stopScan: 'Stop',
    startScan: 'Scan',
    spaceTitle: 'Matrakes Naranja',
    spaceDesc: 'Type and listen. Every time you press the spacebar, it will read the word.',
    talkTitle: 'NaranjaTalk',
    talkDesc: 'Advanced dynamic communicator. Create boards with pictograms or text.',
    voiceTitle: 'NaranjaVoice',
    voiceDesc: 'Interactive speech therapy tool with visual feedback.',
    scanTitle: 'NaranjaScan',
    scanDesc: 'Configure sweep navigation for the entire application.',
    typeTitle: 'NaranjaType',
    typeDesc: 'Smart on-screen keyboard with word prediction.',
    footer: 'By Álvaro González Sánchez. Based on Proyecto Fressa by Jordi.',
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    close: 'Close',
    checkForUpdates: 'Check for updates',
    updateAvailable: 'Update available! Downloading...',
    updateReady: 'Update ready. Click here to restart and install.',
    noUpdate: 'The application is up to date.',
    checking: 'Checking for updates...'
  }
};

// --- HOME COMPONENT ---
function Home({ isScanning, setIsScanning, theme, setTheme, lang, setLang }: any) {
  const [scannedIndex, setScannedIndex] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const navigate = useNavigate();
  const t = translations[lang];

  useEffect(() => {
    // Escuchar eventos de actualización si estamos en Electron
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.on('update-status', (_: any, message: string) => {
        setUpdateStatus(message);
      });
      return () => {
        ipcRenderer.removeAllListeners('update-status');
      };
    }
  }, []);

  const checkForUpdates = () => {
    setUpdateStatus('checking');
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('check-for-updates');
    } else {
      setTimeout(() => setUpdateStatus('noUpdate'), 1500);
    }
  };

  const installUpdate = () => {
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('install-update');
    }
  };

  const modules = [
    {
      id: 'space',
      title: t.spaceTitle,
      icon: <Type size={48} strokeWidth={1.5} />,
      desc: t.spaceDesc,
      color: '#f43f5e',
      path: '/space'
    },
    {
      id: 'talk',
      title: t.talkTitle,
      icon: <MessageSquare size={48} strokeWidth={1.5} />,
      desc: t.talkDesc,
      color: 'var(--primary)',
      path: '/talk'
    },
    {
      id: 'voice',
      title: t.voiceTitle,
      icon: <Mic size={48} strokeWidth={1.5} />,
      desc: t.voiceDesc,
      color: '#4ade80',
      path: '/voice'
    },
    {
      id: 'scan',
      title: t.scanTitle,
      icon: <MousePointerClick size={48} strokeWidth={1.5} />,
      desc: t.scanDesc,
      color: '#60a5fa',
      path: '/scan'
    },
    {
      id: 'type',
      title: t.typeTitle,
      icon: <Keyboard size={48} strokeWidth={1.5} />,
      desc: t.typeDesc,
      color: '#c084fc',
      path: '/type'
    }
  ];

  // Kanghooru style scanning simulator
  useEffect(() => {
    let interval: number;
    if (isScanning && !showSettings) {
      interval = window.setInterval(() => {
        setScannedIndex(prev => (prev + 1) % (modules.length + 1));
      }, 1500);
    } else {
      setScannedIndex(-1);
    }
    return () => clearInterval(interval);
  }, [isScanning, modules.length, showSettings]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isScanning && scannedIndex >= 0 && !showSettings) {
          if (scannedIndex === modules.length) {
            setIsScanning(false);
          } else {
            navigate(modules[scannedIndex].path);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScanning, scannedIndex, modules, navigate, setIsScanning, showSettings]);

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          <Sun className="logo-icon" size={36} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '1.2rem', lineHeight: '1', fontWeight: 600 }}>Proyecto</div>
            <div className="text-gradient" style={{ fontSize: '1.8rem' }}>Naranja</div>
          </div>
        </Link>
        <div className="header-actions">
          <button 
            className={`btn-primary ${scannedIndex === modules.length ? 'scan-focus' : ''}`}
            onClick={() => setIsScanning(!isScanning)}
            aria-label={isScanning ? t.stopScan : t.startScan}
          >
            {isScanning ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            <span>{isScanning ? t.stopScan : t.startScan}</span>
          </button>
          <button className="btn-icon" aria-label={t.settings} onClick={() => setShowSettings(true)}>
            <Settings size={24} />
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h1 dangerouslySetInnerHTML={{ __html: t.heroTitle }}></h1>
          <p className="subtitle">{t.heroSubtitle}</p>
        </section>

        <div className="modules-grid">
          {modules.map((mod, index) => (
            <div 
              key={mod.id} 
              className={`module-card glass-panel ${scannedIndex === index ? 'scan-focus' : ''}`}
              onClick={() => navigate(mod.path)}
              role="button"
              tabIndex={0}
              aria-label={`Abrir ${mod.title}`}
            >
              <div className="module-icon" style={{ color: mod.color }}>
                {mod.icon}
              </div>
              <div className="module-content">
                <h3 className="module-title" style={{ color: mod.color }}>{mod.title}</h3>
                <p className="module-desc">{mod.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showSettings && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '90%', maxWidth: '500px', position: 'relative' }}>
            <button 
              onClick={() => setShowSettings(false)}
              className="btn-icon"
              style={{ position: 'absolute', top: '1rem', right: '1rem' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>{t.settings}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{t.theme}</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className={`btn-secondary ${theme === 'light' ? 'scan-focus' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <Sun size={20} /> {t.light}
                  </button>
                  <button 
                    className={`btn-secondary ${theme === 'dark' ? 'scan-focus' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon size={20} /> {t.dark}
                  </button>
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{t.language}</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className={`btn-secondary ${lang === 'es' ? 'scan-focus' : ''}`}
                    onClick={() => setLang('es')}
                  >
                    Español
                  </button>
                  <button 
                    className={`btn-secondary ${lang === 'en' ? 'scan-focus' : ''}`}
                    onClick={() => setLang('en')}
                  >
                    English
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', backgroundColor: updateStatus === 'updateReady' ? '#4ade80' : '' }}
                  onClick={updateStatus === 'updateReady' ? installUpdate : checkForUpdates}
                  disabled={updateStatus === 'checking' || updateStatus === 'updateAvailable'}
                >
                  <RefreshCw size={20} className={updateStatus === 'checking' ? 'logo-icon' : ''} /> 
                  {updateStatus === '' && t.checkForUpdates}
                  {updateStatus === 'checking' && t.checking}
                  {updateStatus === 'updateAvailable' && t.updateAvailable}
                  {updateStatus === 'updateReady' && t.updateReady}
                  {updateStatus === 'noUpdate' && t.noUpdate}
                  {updateStatus === 'error' && 'Error al buscar actualizaciones'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- MAIN APP ---
function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('naranja-theme') || 'light');
  const [lang, setLang] = useState(localStorage.getItem('naranja-lang') || 'es');

  useEffect(() => {
    localStorage.setItem('naranja-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('naranja-lang', lang);
  }, [lang]);

  const t = translations[lang];

  return (
    <HashRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home isScanning={isScanning} setIsScanning={setIsScanning} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />} />
          <Route path="/space" element={<NaranjaSpace />} />
          <Route path="/talk" element={<NaranjaTalk />} />
          <Route path="/voice" element={<NaranjaVoice />} />
          <Route path="/scan" element={<NaranjaScan />} />
          <Route path="/type" element={<NaranjaType />} />
        </Routes>
        <footer style={{ textAlign: 'center', padding: '2rem 0 1rem 0', color: 'var(--text-muted)', marginTop: 'auto', fontSize: '0.9rem' }}>
          <p>{t.footer}</p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
