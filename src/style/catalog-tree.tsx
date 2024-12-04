import {
  useTreeItem2,
  UseTreeItem2Parameters
} from '@mui/x-tree-view/useTreeItem2';
import React, { useContext } from 'react';
import { Entity } from '../types/interfaces';
import { styled } from '@mui/material/styles';
import {
  TreeItem2Checkbox,
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Props,
  TreeItem2Root
} from '@mui/x-tree-view/TreeItem2';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import TableChartIcon from '@mui/icons-material/TableChart';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import { getColumnIconClass } from './column-icons';
import StorageIcon from '@mui/icons-material/Storage';
import { alpha, IconButton } from '@mui/material';
import { animated, useSpring } from '@react-spring/web';
import Collapse from '@mui/material/Collapse';
import { TransitionProps } from '@mui/material/transitions';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import clsx from 'clsx';
import { TreeItem2DragAndDropOverlay, TreeItem2Icon } from '@mui/x-tree-view';
import Box from '@mui/material/Box';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { NotebookTrackerContext } from '../context/notebook-tracker';
import { insertEntityToNotebook } from '../components/functions/InsertEntity';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {
  entities: {
    [key: string]: Entity;
  };
  onExploreClick: (entity: Entity) => void;
  console: Console;
}

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color: theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
      icon: 'jp-icon-catalog'
    }
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800]
  })
}));

const getIconFromEntity = (entity: Entity) => {
  if ('catalog_name' in entity && 'schema_name' in entity) {
    return TableChartIcon;
  } else if ('catalog_name' in entity) {
    return BackupTableIcon;
  } else if ('type_name' in entity) {
    return getColumnIconClass(entity.type_name);
  } else {
    return StorageIcon;
  }
};

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  flexDirection: 'row',
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  fontWeight: 500,
  [`&.Mui-expanded `]: {
    '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon':
      {
        color: theme.palette.primary.dark,
        ...theme.applyStyles('light', {
          color: theme.palette.primary.main
        })
      },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '16px',
      top: '44px',
      height: 'calc(100% - 48px)',
      width: '1.5px',
      backgroundColor: theme.palette.grey[700],
      ...theme.applyStyles('light', {
        backgroundColor: theme.palette.grey[300]
      })
    }
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: 'white',
    ...theme.applyStyles('light', {
      color: theme.palette.primary.main
    })
  },
  [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    ...theme.applyStyles('light', {
      backgroundColor: theme.palette.primary.main
    })
  }
}));

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`
    }
  });

  return <AnimatedCollapse style={style} {...props} />;
}

export interface CustomTreeItemSlotProps extends TreeItem2Props {
  entities: {
    [key: string]: Entity;
  };
  onExploreClick: (entity: Entity) => void;
  console: Console;
}

export const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>
) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
    publicAPI
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  props.console.log('Adding Tree Item', item);
  const entity = props.entities[item.id];

  const icon = entity ? getIconFromEntity(entity) : undefined;
  // const onExploreClick = props.onExploreClick

  return (
    <TreeItem2Provider itemId={itemId}>
      <StyledTreeItemRoot {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx('content', {
              'Mui-expanded': status.expanded,
              'Mui-selected': status.selected,
              'Mui-focused': status.focused,
              'Mui-disabled': status.disabled
            })
          })}
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2Checkbox {...getCheckboxProps()} />
          <CustomLabel
            {...getLabelProps({
              icon: icon,
              entity: entity,
              itemId: itemId,
              onExploreClick: props.onExploreClick
            })}
          />
          <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}{' '}
      </StyledTreeItemRoot>
    </TreeItem2Provider>
  );
});

interface CustomLabelProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  entity: Entity;
  itemId: string;
  onExploreClick: (entity: Entity) => void;
}

function CustomLabel({
  icon: Icon,
  entity,
  itemId,
  onExploreClick,
  children,
  ...other
}: CustomLabelProps) {
  const explore = !('type_name' in entity);
  const notebookTracker = useContext(NotebookTrackerContext);
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'left'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <Box
            component={Icon}
            className="labelIcon"
            color="inherit"
            sx={{ mr: 1, fontSize: '1.2rem' }}
          />
        )}
        {children}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {explore && (
          <IconButton
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onExploreClick(entity);
            }}
            aria-label="explore-button"
            color="inherit"
            title="View in Explorer"
            size="small"
            sx={{
              '&:hover': {
                color: 'orange'
              }
            }}
          >
            <RemoveRedEyeIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        )}
        <IconButton
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            insertEntityToNotebook(itemId, notebookTracker!);
          }}
          aria-label="insert-button"
          color="inherit"
          size="small"
          title="Insert into Notebook"
          sx={{
            '&:hover': {
              color: 'orange'
            }
          }}
        >
          <KeyboardDoubleArrowRightIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      </Box>
    </TreeItem2Label>
  );
}
