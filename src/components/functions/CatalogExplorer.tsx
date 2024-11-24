import { useContext, useState, forwardRef, useImperativeHandle } from 'react';
import { MainAreaWidget } from '@jupyterlab/apputils';
import AppContext from '../../context/app-context';
import { ClientContext } from '../../context/client';
import ExplorerWidget from '../widgets/ExplorerWidget';
import {
  CatalogInterface,
  SchemaInterface,
  TableInterface
} from '../../types/interfaces';

const ExplorerComponent = forwardRef((props, ref) => {
  const [widget, setWidget] = useState<MainAreaWidget<ExplorerWidget> | null>(
    null
  );
  const { app } = useContext(AppContext);
  const apiClient = useContext(ClientContext);

  const handleExploreClick = (
    entity: CatalogInterface | SchemaInterface | TableInterface
  ) => {
    console.log('Selected entity to explore: ', entity);
    let type: 'catalog' | 'schema' | 'table';
    if ('id' in entity) {
      type = 'catalog';
    } else if ('schema_id' in entity) {
      type = 'schema';
    } else {
      type = 'table';
    }
    openWidget(type, entity);
  };

  const createWidget = (
    type: 'catalog' | 'schema' | 'table' | 'frontpage',
    entity: CatalogInterface | SchemaInterface | TableInterface
  ): MainAreaWidget<ExplorerWidget> => {
    console.log('Creating widget for {}', type);
    const content = new ExplorerWidget({
      entity,
      type,
      handleExploreClick,
      apiClient
    });
    const widget = new MainAreaWidget({ content });
    if (type === 'frontpage') {
      widget.id = 'frontpage-widget';
      widget.title.label = 'Catalog Explorer';
    } else {
      widget.id = `${type}-widget-${entity.name}`;
      widget.title.label = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${entity.name}`;
    }
    widget.title.closable = true;
    return widget;
  };

  const openWidget = (
    type: 'catalog' | 'schema' | 'table' | 'frontpage',
    entity: CatalogInterface | SchemaInterface | TableInterface
  ): void => {
    if (widget && !widget.isDisposed) {
      widget.dispose();
    }
    const newWidget = createWidget(type, entity);
    setWidget(newWidget);
    if (!newWidget.isAttached) {
      app.shell.add(newWidget, 'main');
    }
    app.shell.activateById(newWidget.id);
  };

  useImperativeHandle(ref, () => ({
    handleExploreClick,
    openWidget
  }));

  return null;
});

export default ExplorerComponent;
