// columnIcons.test.ts
import { getColumnIconClass } from '../../utils/columnIcons';

describe('getColumnIconClass', () => {
  it('should return jp-icon-boolean for BOOLEAN and BINARY', () => {
    expect(getColumnIconClass('BOOLEAN')).toBe('jp-icon-boolean');
    expect(getColumnIconClass('BINARY')).toBe('jp-icon-boolean');
  });

  it('should return jp-icon-other for NULL, USER_DEFINED_TYPE, and TABLE_TYPE', () => {
    expect(getColumnIconClass('NULL')).toBe('jp-icon-other');
    expect(getColumnIconClass('USER_DEFINED_TYPE')).toBe('jp-icon-other');
    expect(getColumnIconClass('TABLE_TYPE')).toBe('jp-icon-other');
  });

  it('should return jp-icon-numeric for BYTE, SHORT, INT, LONG, FLOAT, DOUBLE, and DECIMAL', () => {
    expect(getColumnIconClass('BYTE')).toBe('jp-icon-numeric');
    expect(getColumnIconClass('SHORT')).toBe('jp-icon-numeric');
    expect(getColumnIconClass('INT')).toBe('jp-icon-numeric');
    expect(getColumnIconClass('LONG')).toBe('jp-icon-numeric');
    expect(getColumnIconClass('FLOAT')).toBe('jp-icon-numeric');
    expect(getColumnIconClass('DOUBLE')).toBe('jp-icon-numeric');
    expect(getColumnIconClass('DECIMAL')).toBe('jp-icon-numeric');
  });

  it('should return jp-icon-temporal for DATE, TIMESTAMP, TIMESTAMP_NTZ, and INTERVAL', () => {
    expect(getColumnIconClass('DATE')).toBe('jp-icon-temporal');
    expect(getColumnIconClass('TIMESTAMP')).toBe('jp-icon-temporal');
    expect(getColumnIconClass('TIMESTAMP_NTZ')).toBe('jp-icon-temporal');
    expect(getColumnIconClass('INTERVAL')).toBe('jp-icon-temporal');
  });

  it('should return jp-icon-string for STRING and CHAR', () => {
    expect(getColumnIconClass('STRING')).toBe('jp-icon-string');
    expect(getColumnIconClass('CHAR')).toBe('jp-icon-string');
  });

  it('should return jp-icon-complex for ARRAY, STRUCT, and MAP', () => {
    expect(getColumnIconClass('ARRAY')).toBe('jp-icon-complex');
    expect(getColumnIconClass('STRUCT')).toBe('jp-icon-complex');
    expect(getColumnIconClass('MAP')).toBe('jp-icon-complex');
  });

  it('should return jp-icon-default for unknown types', () => {
    expect(getColumnIconClass('UNKNOWN')).toBe('jp-icon-default');
  });
});
