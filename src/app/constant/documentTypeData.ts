export const documentType = [
  { id: 1, type: 1, description: 'FACTURA ELECTRONICA', code: 'FX' },
  { id: 2, type: 1, description: 'GUIA DE RECEPCION', code: 'RP' },
  { id: 3, type: 2, description: 'GUIA DE DESPACHO', code: 'DP' },
  { id: 4, type: 2, description: 'GUIA DE DEVOLUCION', code: 'DV' },
  { id: 5, type: 3, description: 'VALE DE CONSUMO', code: 'VC' },
  { id: 6, type: 1, description: 'CONSIGNACIÓN', code: 'RC' },
  { id: 7, type: 2, description: 'CONSIGNACIÓN', code: 'DC' },
];

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
