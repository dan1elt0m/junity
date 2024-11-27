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
  private entity: CatalogInterface | SchemaInterface | TableInterface;
  private type: string;
  private handleExploreClick: (
    entity: CatalogInterface | SchemaInterface | TableInterface
  ) => void;
  private apiClient: AxiosInstance;

  constructor(props: ExplorerWidgetProps) {
    super();
    this.addClass('explorer-widget');
    this.entity = props.entity;
    this.type = props.type;
    this.handleExploreClick = props.handleExploreClick;
    this.apiClient = props.apiClient;
  }

  updateEntity(
    entity: CatalogInterface | SchemaInterface | TableInterface,
    type: 'catalog' | 'schema' | 'table' | 'frontpage'
  ) {
    this.entity = entity;
    this.type = type;
    this.update();
  }

  protected render(): ReactElement {
    return (
      <QueryClientProvider client={queryClient}>
        <ClientContext.Provider value={this.apiClient}>
          <div className="widget-container">
            {this.type === 'catalog' && (
              <CatalogDetails
                catalog={this.entity as CatalogInterface}
                onSchemaClick={this.handleExploreClick}
              />
            )}
            {this.type === 'schema' && (
              <SchemaDetails
                schema={this.entity as SchemaInterface}
                onTableClick={this.handleExploreClick}
              />
            )}
            {this.type === 'table' && (
              <TableDetails table={this.entity as TableInterface} />
            )}
            {this.type === 'frontpage' && (
              <ExplorerDetails onCatalogClick={this.handleExploreClick} />
            )}
          </div>
        </ClientContext.Provider>
      </QueryClientProvider>
    );
  }
}

export default ExplorerWidget;
