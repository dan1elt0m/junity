import { getColumnIconClass } from '../utils/columnIcons';

describe('getColumnIconClass', () => {
  it('should return the correct icon class for BOOLEAN type', () => {
    expect(getColumnIconClass('BOOLEAN')).toBe('jp-icon-boolean');
  });

  it('should return the correct icon class for STRING type', () => {
    expect(getColumnIconClass('STRING')).toBe('jp-icon-string');
  });

  it('should return the default icon class for unknown type', () => {
    expect(getColumnIconClass('UNKNOWN')).toBe('jp-icon-default');
  });
});
