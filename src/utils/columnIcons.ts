export const getColumnIconClass = (dataType: string): string => {
  switch (dataType) {
    case 'BOOLEAN':
    case 'BINARY':
      return 'jp-icon-boolean';
    case 'NULL':
    case 'USER_DEFINED_TYPE':
    case 'TABLE_TYPE':
      return 'jp-icon-other';
    case 'BYTE':
    case 'SHORT':
    case 'INT':
    case 'LONG':
    case 'FLOAT':
    case 'DOUBLE':
    case 'DECIMAL':
      return 'jp-icon-numeric';
    case 'DATE':
    case 'TIMESTAMP':
    case 'TIMESTAMP_NTZ':
    case 'INTERVAL':
      return 'jp-icon-temporal';
    case 'STRING':
    case 'CHAR':
      return 'jp-icon-string';
    case 'ARRAY':
    case 'STRUCT':
    case 'MAP':
      return 'jp-icon-complex';
    default:
      return 'jp-icon-default';
  }
};
