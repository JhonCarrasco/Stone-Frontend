export const zoneList = [
  {
    id: 1,
    description:
      'Oriente: Las Condes, Providencia, Vitacura, Lo Barnechea, La Reina, Ñuñoa, Peñalolén',
  },
  {
    id: 2,
    description: 'Centro: Santiago, Independencia, Quinta Normal, Recoleta',
  },
  { id: 3, description: 'Norte: Conchalí, Huechuraba, Quilicura, Renca' },
  {
    id: 4,
    description:
      'Sur: San Miguel, San Joaquín, La Cisterna, El Bosque, La Granja, La Pintana, Lo Espejo, Pedro Aguirre Cerda, San Ramón',
  },
  {
    id: 5,
    description:
      'Surponiente: Maipú, Pudahuel, Cerrillos, Cerro Navia, Lo Prado, Estación Central',
  },
  { id: 6, description: 'Suroriente: Puente Alto, Pirque, San José de Maipo' },
];

export const getZoneDescription = (stateId: number | null): string => {
  stateId = stateId ?? 0; // Si stateId es null o undefined, se asigna 0
  const state = zoneList.find((s) => s.id === stateId);
  return state ? state.description : 'Desconocido';
};

export const getZoneIdByDescription = (description: string): number | null => {
  const state = zoneList.find((s) => s.description === description);
  return state ? state.id : null;
};
