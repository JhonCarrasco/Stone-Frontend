export const statesBudget = [
  { id: 0, description: 'Ingresado' },
  { id: 1, description: 'Aceptado' },
  { id: 2, description: 'Rechazado' },
  { id: 3, description: 'En Proceso' },
  { id: 4, description: 'Completado' },
  { id: 5, description: 'Inactivo' },
  { id: 6, description: 'En Espera' },
  { id: 7, description: 'Cerrado' },
  { id: 8, description: 'Eliminado' },
];

export const getStateDescription = (stateId: number | null): string => {
  stateId = stateId ?? 0; // Si stateId es null o undefined, se asigna 0
  const state = statesBudget.find((s) => s.id === stateId);
  return state ? state.description : 'Desconocido';
};

export const getStateIdByDescription = (description: string): number | null => {
  const state = statesBudget.find((s) => s.description === description);
  return state ? state.id : null;
};
