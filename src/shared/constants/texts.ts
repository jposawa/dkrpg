import { AttributeKey } from "../types"

export const termsList: {[key: string]: string} = {
  fortitude: "Físico",
  coordination: "Coordenação",
  intelect: "Intelecto",
  sagacity: "Sagacidade",
  willpower: "Vontade",
  presence: "Presença",
  wound: "Ferimento",
  stress: "Estresse",
  resistance: "Resistência",
  capacity: "Capacidade",
  binding: "Vínculo",
}

export const ATTRIBUTE_KEY: Record<string, AttributeKey> = {
  FORTITUDE: "fortitude",
  COORDINATION: "coordination",
  INTELECT: "intelect",
  SAGACITY: "sagacity",
  WILLPOWER: "willpower",
  PRESENCE: "presence",
}