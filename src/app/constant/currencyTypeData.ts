export const currencyTypeData = [
  { id: 1, description: 'Peso (CLP)' },
  { id: 2, description: 'Dolar (USD)' },
  { id: 3, description: 'Euro (EUR)' },
];

export const getCurrencyTypeDescription = (id: number | null): string => {
  id = id ?? 0; // Si id es null o undefined, se asigna 0
  const _currencyType = currencyTypeData.find((s) => s.id === id);
  return _currencyType ? _currencyType.description : 'Desconocido';
};

export const getCurrencyTypeIdByDescription = (
  description: string,
): number | null => {
  const _currencyType = currencyTypeData.find(
    (s) => s.description === description,
  );
  return _currencyType ? _currencyType.id : null;
};
