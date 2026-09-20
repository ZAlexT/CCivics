/* CCivics popup: settings and one-shot analysis request. */
const key = 'ccivics-settings'; const defaults = { language: 'ca', theme: 'system' };
const text = { ca: ['Analitza la pàgina', 'Obre una pàgina inscripcionscc.com per analitzar-la.', 'Pàgina compatible.'], es: ['Analizar página', 'Abre una página inscripcionscc.com para analizarla.', 'Página compatible.'], en: ['Analyze page', 'Open an inscripcionscc.com page to analyze it.', 'Supported page.'] };
(async () => { const settings = { ...defaults, ...(await chrome.storage.sync.get(key))[key] }; language.value = settings.language; theme.value = settings.theme; refresh(); })();
function refresh(status) { const [action, unsupported, supported] = text[language.value]; analyze.textContent = action; if (status !== undefined) status.textContent = status ? supported : unsupported; }
async function save() { await chrome.storage.sync.set({ [key]: { language: language.value, theme: theme.value } }); refresh(); }
language.onchange = save; theme.onchange = save;
analyze.onclick = async () => { const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); try { const result = await chrome.tabs.sendMessage(tab.id, { type: 'CCIVICS_ANALYZE' }); refresh(result.supported); } catch { refresh(false); } };
