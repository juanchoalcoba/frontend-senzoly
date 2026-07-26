import { Briefcase, Calendar, PartyPopper, Scissors, Trophy } from 'lucide-react';

const BUSINESS_TYPE_PRESENTATION = {
  barberias: { icon: Scissors, serviceLabel: 'Servicio' },
  canchas: { icon: Trophy, serviceLabel: 'Cancha o servicio' },
  profesionales: { icon: Briefcase, serviceLabel: 'Servicio' },
  'salones-de-eventos': { icon: PartyPopper, serviceLabel: 'Espacio o servicio' },
  default: { icon: Calendar, serviceLabel: 'Servicio' },
};

export const getBusinessTypePresentation = (businessTypeSlug) => (
  BUSINESS_TYPE_PRESENTATION[businessTypeSlug] || BUSINESS_TYPE_PRESENTATION.default
);
