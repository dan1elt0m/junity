import NumbersIcon from '@mui/icons-material/Numbers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AbcIcon from '@mui/icons-material/Abc';
import DataObjectIcon from '@mui/icons-material/DataObject';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import PersonIcon from '@mui/icons-material/Person';
import TocIcon from '@mui/icons-material/Toc';

export const getColumnIconClass = (dataType: string): React.ElementType => {
  switch (dataType) {
    case 'BOOLEAN':
    case 'BINARY':
      return ToggleOffIcon;
    case 'NULL':
      return CheckBoxOutlineBlankIcon;
    case 'USER_DEFINED_TYPE':
      return PersonIcon;
    case 'TABLE_TYPE':
      return TocIcon;
    case 'BYTE':
    case 'SHORT':
    case 'INT':
    case 'LONG':
    case 'FLOAT':
    case 'DOUBLE':
    case 'DECIMAL':
      return NumbersIcon;
    case 'DATE':
    case 'TIMESTAMP':
    case 'TIMESTAMP_NTZ':
    case 'INTERVAL':
      return CalendarMonthIcon;
    case 'STRING':
    case 'CHAR':
      return AbcIcon;
    case 'ARRAY':
    case 'STRUCT':
    case 'MAP':
      return DataObjectIcon;
    default:
      return NotListedLocationIcon;
  }
};
