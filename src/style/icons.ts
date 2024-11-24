import { LabIcon } from '@jupyterlab/ui-components';
import junitySvgStr from '../../assets/icons/junity.svg';
import treeSvgStr from '../../assets/icons/sidebar/icon-tree-black.svg';
import catalogSvgStr from '../../assets/icons/sidebar/icon-catalog-black.svg';
import logoutSvgStr from '../../assets/icons/tree/icon-logout-black.svg';

export const junityIcon: LabIcon = new LabIcon({
  name: 'junity:logo',
  svgstr: junitySvgStr
});

export const treeIcon: LabIcon = new LabIcon({
  name: 'sidebar:tree',
  svgstr: treeSvgStr
});

export const catalogIcon: LabIcon = new LabIcon({
  name: 'sidebar:catalog',
  svgstr: catalogSvgStr
});


export const logoutIcon: LabIcon = new LabIcon({
  name: 'mainpanel:logout',
  svgstr: logoutSvgStr
});