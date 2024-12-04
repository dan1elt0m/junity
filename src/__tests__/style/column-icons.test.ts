import { getColumnIconClass } from '../../style/column-icons';
import NumbersIcon from '@mui/icons-material/Numbers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AbcIcon from '@mui/icons-material/Abc';
import DataObjectIcon from '@mui/icons-material/DataObject';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import PersonIcon from '@mui/icons-material/Person';
import TocIcon from '@mui/icons-material/Toc';

describe('getColumnIconClass', () => {
  it('should return ToggleOffIcon for BOOLEAN and BINARY', () => {
    expect(getColumnIconClass('BOOLEAN')).toBe(ToggleOffIcon);
    expect(getColumnIconClass('BINARY')).toBe(ToggleOffIcon);
  });

  it('should return CheckBoxOutlineBlankIcon for NULL', () => {
    expect(getColumnIconClass('NULL')).toBe(CheckBoxOutlineBlankIcon);
  });

  it('should return PersonIcon for USER_DEFINED_TYPE', () => {
    expect(getColumnIconClass('USER_DEFINED_TYPE')).toBe(PersonIcon);
  });

  it('should return TocIcon for TABLE_TYPE', () => {
    expect(getColumnIconClass('TABLE_TYPE')).toBe(TocIcon);
  });

  it('should return NumbersIcon for BYTE, SHORT, INT, LONG, FLOAT, DOUBLE, and DECIMAL', () => {
    expect(getColumnIconClass('BYTE')).toBe(NumbersIcon);
    expect(getColumnIconClass('SHORT')).toBe(NumbersIcon);
    expect(getColumnIconClass('INT')).toBe(NumbersIcon);
    expect(getColumnIconClass('LONG')).toBe(NumbersIcon);
    expect(getColumnIconClass('FLOAT')).toBe(NumbersIcon);
    expect(getColumnIconClass('DOUBLE')).toBe(NumbersIcon);
    expect(getColumnIconClass('DECIMAL')).toBe(NumbersIcon);
  });

  it('should return CalendarMonthIcon for DATE, TIMESTAMP, TIMESTAMP_NTZ, and INTERVAL', () => {
    expect(getColumnIconClass('DATE')).toBe(CalendarMonthIcon);
    expect(getColumnIconClass('TIMESTAMP')).toBe(CalendarMonthIcon);
    expect(getColumnIconClass('TIMESTAMP_NTZ')).toBe(CalendarMonthIcon);
    expect(getColumnIconClass('INTERVAL')).toBe(CalendarMonthIcon);
  });

  it('should return AbcIcon for STRING and CHAR', () => {
    expect(getColumnIconClass('STRING')).toBe(AbcIcon);
    expect(getColumnIconClass('CHAR')).toBe(AbcIcon);
  });

  it('should return DataObjectIcon for ARRAY, STRUCT, and MAP', () => {
    expect(getColumnIconClass('ARRAY')).toBe(DataObjectIcon);
    expect(getColumnIconClass('STRUCT')).toBe(DataObjectIcon);
    expect(getColumnIconClass('MAP')).toBe(DataObjectIcon);
  });

  it('should return NotListedLocationIcon for unknown types', () => {
    expect(getColumnIconClass('UNKNOWN')).toBe(NotListedLocationIcon);
  });
});
