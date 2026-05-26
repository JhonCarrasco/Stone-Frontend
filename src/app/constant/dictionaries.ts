export interface NumberStringDictionary {
  [key: number]: string;
}

export const STATE_BUDGET: NumberStringDictionary = {
  0: "Activo",
  1: "Aceptado",
  2: "Rechazado",
  3: "En Proceso",
  4: "Completado",
  5: "Inactivo",
  6: "En Espera",
  7: "Cerrado",
  8: "Eliminado",
};
