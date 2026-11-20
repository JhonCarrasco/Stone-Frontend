export const documentType = [
  { id: 1, type: 2, description: 'FACTURA ELECTRÓNICA', code: 'FX' },
  { id: 2, type: 2, description: 'GUIA DE RECEPCIÓN', code: 'RP' },
  { id: 3, type: 3, description: 'GUIA DE DESPACHO', code: 'DP' },
  { id: 4, type: 3, description: 'GUIA DE DEVOLUCIÓN', code: 'DV' },
  { id: 5, type: 4, description: 'VALE DE CONSUMO', code: 'VC' },
  { id: 6, type: 2, description: 'CONSIGNACIÓN RECEPCIÓN', code: 'RC' },
  { id: 7, type: 3, description: 'CONSIGNACIÓN DESPACHO', code: 'DC' },
  { id: 8, type: 1, description: 'PRESUPUESTO', code: 'PP' },
  { id: 9, type: 5, description: 'RENDICIÓN DE GASTOS', code: 'RG' },
];

export enum DocumentDriveType {
  Bulget = 1,
  Reception = 2,
  Dispatch = 3,
  Voucher = 4,
  Expense = 5,
}

export const getDocumentTypeDescription = (id: number | null): string => {
  id = id ?? 0; // Si id es null o undefined, se asigna 0
  const _documentType = documentType.find((s) => s.id === id);
  return _documentType ? _documentType.description : 'Desconocido';
};

export const getDocumentTypeCode = (id: number | null): string => {
  id = id ?? 0; // Si id es null o undefined, se asigna 0
  const _documentType = documentType.find((s) => s.id === id);
  return _documentType ? _documentType.code : 'Desconocido';
};

export const getDocumentTypeIdByDescription = (
  description: string,
): number | null => {
  const _documentType = documentType.find((s) => s.description === description);
  return _documentType ? _documentType.id : null;
};
