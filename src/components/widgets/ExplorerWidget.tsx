import React, { ReactElement } from 'react';
import { AxiosInstance } from 'axios';
import { ReactWidget } from '@jupyterlab/ui-components';
import CatalogDetails from '../explorer/CatalogDetails';
import '../../../style/explorerWidget.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientContext } from '../../context/client';
import SchemaDetails from '../explorer/SchemaDetails';
import TableDetails from '../explorer/TableDetails';
import {
  CatalogInterface,
  SchemaInterface,
  TableInterface
} from '../../types/interfaces';
import ExplorerDetails from '../explorer/ExplorerDetails';

interface ExplorerWidgetProps {
  entity: CatalogInterface | SchemaInterface | TableInterface;
  type: string;
  handleExploreClick: (
    entity: CatalogInterface | SchemaInterface | TableInterface
  ) => void;
  apiClient: AxiosInstance;
}

const queryClient = new QueryClient();

class ExplorerWidget extends ReactWidget {
  constructor(private props: ExplorerWidgetProps) {
    super();
    this.addClass('explorer-widget');
    this.props = props;
  }

  protected render(): ReactElement {
    const { entity, type } = this.props;

    return (
      <QueryClientProvider client={queryClient}>
        <ClientContext.Provider value={this.props.apiClient}>
          <div className="widget-container">
            {type === 'catalog' && (
              <CatalogDetails
                catalog={entity as CatalogInterface}
                onSchemaClick={this.props.handleExploreClick}
              />
            )}
            {type === 'schema' && (
              <SchemaDetails
                schema={entity as SchemaInterface}
                onTableClick={this.props.handleExploreClick}
              />
            )}
            {type === 'table' && (
              <TableDetails table={entity as TableInterface} />
            )}
            {type === 'frontpage' && (
              <ExplorerDetails onCatalogClick={this.props.handleExploreClick} />
            )}
          </div>
        </ClientContext.Provider>
      </QueryClientProvider>
    );
  }
}

export default ExplorerWidget;
