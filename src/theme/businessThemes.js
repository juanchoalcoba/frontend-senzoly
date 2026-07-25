const BUSINESS_THEMES = {
  default: {
    key: 'default',
    label: 'Senzoly',
    primary: '#f97316',
    primaryStrong: '#ea580c',
    primarySoft: '#fff7ed',
    primaryMuted: '#ffedd5',
    dark: '#7c2d12',
    glow: '#fb923c',
  },
  barberias: {
    key: 'barberias',
    label: 'Barbería',
    primary: '#b88939',
    primaryStrong: '#93691f',
    primarySoft: '#fff8e7',
    primaryMuted: '#f7e6bb',
    dark: '#21180b',
    glow: '#d4a754',
  },
  canchas: {
    key: 'canchas',
    label: 'Canchas',
    primary: '#16a34a',
    primaryStrong: '#15803d',
    primarySoft: '#f0fdf4',
    primaryMuted: '#dcfce7',
    dark: '#052e16',
    glow: '#4ade80',
  },
  profesionales: {
    key: 'profesionales',
    label: 'Profesionales',
    primary: '#2563eb',
    primaryStrong: '#1d4ed8',
    primarySoft: '#eff6ff',
    primaryMuted: '#dbeafe',
    dark: '#172554',
    glow: '#60a5fa',
  },
  'salones-de-eventos': {
    key: 'salones-de-eventos',
    label: 'Eventos',
    primary: '#7e22ce',
    primaryStrong: '#6b21a8',
    primarySoft: '#faf5ff',
    primaryMuted: '#f3e8ff',
    dark: '#3b0764',
    glow: '#c084fc',
  },
};

export const getBusinessTheme = (businessTypeSlug) => (
  BUSINESS_THEMES[businessTypeSlug] || BUSINESS_THEMES.default
);

export default BUSINESS_THEMES;
