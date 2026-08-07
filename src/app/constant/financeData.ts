export const expenseType = [
  { id: 1, description: 'Combustible' },
  { id: 2, description: 'Compra' },
  { id: 3, description: 'Peaje' },
  { id: 4, description: 'Estacionamiento' },
  { id: 5, description: 'Alojamiento' },
  { id: 6, description: 'Colación' },
  { id: 7, description: 'Pasajes' },
  { id: 8, description: 'Otro' },
];

export const methodPayment = [
  { id: 1, description: 'Efectivo' },
  { id: 2, description: 'Tarjeta' },
  { id: 3, description: 'Transferencia' },
];

export const paymentReceipt = [
  { id: 1, description: 'Boleta' },
  { id: 2, description: 'Factura' },
  { id: 3, description: 'Otro' },
];

export const getExpenseTypeDescription = (id: number | null): string => {
  id = id ?? 0; // Si id es null o undefined, se asigna 0
  const _expenseType = expenseType.find((s) => s.id === id);
  return _expenseType ? _expenseType.description : 'Desconocido';
};

export const getExpenseTypeIdByDescription = (
  description: string,
): number | null => {
  const _expenseType = expenseType.find((s) => s.description === description);
  return _expenseType ? _expenseType.id : null;
};
