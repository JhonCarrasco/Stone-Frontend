export const typePersonData = [
  { id: 1, description: 'Natural' },
  { id: 2, description: 'Juridico' },
];

export const getTypePersonDescription = (id: number | null): string => {
  id = id ?? 0; // Si id es null o undefined, se asigna 0
  const _typePerson = typePersonData.find((s) => s.id === id);
  return _typePerson ? _typePerson.description : 'Desconocido';
};

export const getTypePersonIdByDescription = (
  description: string,
): number | null => {
  const _typePerson = typePersonData.find((s) => s.description === description);
  return _typePerson ? _typePerson.id : null;
};
