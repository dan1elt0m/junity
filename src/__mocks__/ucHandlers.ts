import { http, HttpResponse } from 'msw';
import { UC_API_PREFIX } from '../utils/constants';

export const ucHandlers = [
  // Handler for catalogs
  http.get(`http://localhost:8080${UC_API_PREFIX}/catalogs`, () => {
    return new HttpResponse(
      JSON.stringify({
        catalogs: [
          { id: '1', name: 'Catalog1' },
          { id: '2', name: 'Catalog2' }
        ],
        next_page_token: null
      }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost'
        }
      }
    );
  }),

  // Handler for schemas
  http.get(`http://localhost:8080${UC_API_PREFIX}/schemas`, info => {
    const url = new URL(info.request.url);
    const catalog = url.searchParams.get('catalog_name');
    if (catalog === 'Catalog1') {
      return new HttpResponse(
        JSON.stringify({
          schemas: [
            { id: '1', name: 'Schema1' },
            { id: '2', name: 'Schema2' }
          ],
          next_page_token: null
        }),
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost'
          }
        }
      );
    }
    return new HttpResponse(
      JSON.stringify({
        schemas: [],
        next_page_token: null
      }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost'
        }
      }
    );
  }),

  // Handler for tables
  http.get(`http://localhost:8080${UC_API_PREFIX}/tables`, info => {
    const url = new URL(info.request.url);
    const catalog = url.searchParams.get('catalog_name');
    const schema = url.searchParams.get('schema_name');
    if (catalog === 'Catalog1' && schema === 'Schema1') {
      return new HttpResponse(
        JSON.stringify({
          tables: [
            { id: '1', name: 'Table1' },
            { id: '2', name: 'Table2' }
          ],
          next_page_token: null
        }),
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost'
          }
        }
      );
    }
    return new HttpResponse(
      JSON.stringify({
        tables: [],
        next_page_token: null
      }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost'
        }
      }
    );
  }),

  // Handler for OPTIONS tables requests
  http.options(`http://localhost:8080${UC_API_PREFIX}/tables`, () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, x-interceptors-internal-request-id'
      }
    });
  }),

  // Handler for OPTIONS schemas requests
  http.options(`http://localhost:8080${UC_API_PREFIX}/schemas`, () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, x-interceptors-internal-request-id'
      }
    });
  })
];
