import { useContext, forwardRef, useImperativeHandle } from 'react';
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
    const content = new ExplorerWidget({
      entity,
      type,
      handleExploreClick,
      apiClient
    });
    const widget = new MainAreaWidget({ content });
    widget.id = 'jy-explorer-widget';
    widget.title.label = 'Catalog Explorer';
    widget.title.closable = true;
    return widget;
  };

  const openWidget = (
    type: 'catalog' | 'schema' | 'table' | 'frontpage',
    entity: CatalogInterface | SchemaInterface | TableInterface
  ): void => {
    const widgets = [...app.shell.widgets('main')];
    const existingWidget = widgets.find(w => w.id === 'jy-explorer-widget') as
      | MainAreaWidget<ExplorerWidget>
      | undefined;

    if (existingWidget && !existingWidget.isDisposed) {
      console.log('Updating widget ');
      existingWidget.content.updateEntity(entity, type);
      existingWidget.update();
      app.shell.activateById(existingWidget.id);
    } else {
      console.log(`Creating ${type} widget`);
      const newWidget = createWidget(type, entity);
      if (!newWidget.isAttached) {
        app.shell.add(newWidget, 'main');
      }
      app.shell.activateById(newWidget.id);
    }
  };

  useImperativeHandle(ref, () => ({
    handleExploreClick,
    openWidget
  }));

  return null;
});

export default ExplorerComponent;
