/**
 * Speech Service para Proyecto Naranja
 * 
 * Usa las voces instaladas en el sistema operativo a través de window.speechSynthesis.
 * En Electron (Chromium), esto da acceso a TODAS las voces Microsoft SAPI instaladas
 * en Windows (ej: Microsoft Pablo, Microsoft Helena, Microsoft Alvaro...).
 * 
 * Para instalar voces Microsoft en español en Windows:
 *   1. Ajustes > Hora e idioma > Idioma > Español (España)
 *   2. Clic en "Opciones" > "Voz" > Descargar voces
 *   3. Esto instala las voces Microsoft offline de alta calidad
 */

// --- Cache de voces para evitar problemas de timing ---
let cachedVoices: SpeechSynthesisVoice[] = [];

const loadVoices = (): SpeechSynthesisVoice[] => {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
};

// Precargar voces
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => loadVoices();
}

/**
 * Busca la mejor voz española disponible en el sistema.
 * Prioridad:
 *   1. Microsoft Alvaro / Pablo / Helena (voces SAPI offline de Windows)
 *   2. Cualquier voz Microsoft en español
 *   3. Cualquier voz en español
 */
export const findBestSpanishVoice = (): SpeechSynthesisVoice | null => {
  const voices = loadVoices();
  
  // 1. Buscar voces Microsoft específicas en español
  const msSpanishNames = ['Alvaro', 'Álvaro', 'Pablo', 'Helena', 'Elvira', 'Laura'];
  for (const name of msSpanishNames) {
    const found = voices.find(v => v.name.includes(name) && v.lang.startsWith('es'));
    if (found) return found;
  }
  
  // 2. Cualquier voz Microsoft en español
  const msSpanish = voices.find(v => v.name.includes('Microsoft') && v.lang.startsWith('es'));
  if (msSpanish) return msSpanish;
  
  // 3. Cualquier voz en español
  return voices.find(v => v.lang.startsWith('es')) || null;
};

/**
 * Obtener todas las voces en español disponibles
 */
export const getSpanishVoices = (): SpeechSynthesisVoice[] => {
  const voices = loadVoices();
  return voices.filter(v => v.lang.startsWith('es'));
};

// Referencia global para evitar GC bug de Chrome/Electron
const utteranceRefs: SpeechSynthesisUtterance[] = [];

/**
 * Función principal de síntesis de voz.
 * Usa las voces del sistema operativo (Microsoft SAPI en Windows).
 */
export const speakText = async (
  text: string, 
  _useAzure: boolean = false,
  voice?: SpeechSynthesisVoice | null
): Promise<void> => {
  if (!text.trim()) return;

  // Usar voces del sistema operativo (funciona offline en Electron)
  return new Promise((resolve) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Usar la voz proporcionada o buscar la mejor disponible
    const selectedVoice = voice || findBestSpanishVoice();
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Guardar referencia para evitar que el navegador la borre (GC bug en Chromium)
    utteranceRefs.push(utterance);
    utterance.onend = () => {
      const idx = utteranceRefs.indexOf(utterance);
      if (idx > -1) utteranceRefs.splice(idx, 1);
      resolve();
    };
    utterance.onerror = () => {
      const idx = utteranceRefs.indexOf(utterance);
      if (idx > -1) utteranceRefs.splice(idx, 1);
      resolve();
    };
    
    window.speechSynthesis.speak(utterance);
  });
};
