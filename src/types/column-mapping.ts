export interface ColumnMapping {
  email: string;
  [key: string]: string;
}

export interface MappingField {
  key: string;
  label: string;
  required: boolean;
  description: string;
}

export const DEFAULT_MAPPING_FIELDS: MappingField[] = [
  {
    key: 'email',
    label: 'Adresse Email',
    required: true,
    description: 'Colonne contenant les adresses email des destinataires'
  }
];