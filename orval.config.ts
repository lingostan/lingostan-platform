import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './api.yaml',
    },
    output: {
      mode: 'split',
      target: './api/generated',
      schemas: './api/generated/models',
      client: 'react-query',
      httpClient: 'axios',
      mock: false,
      override: {
        mutator: {
          path: './utils/apiClient.ts',
          name: 'apiClient',
        },
        query: {
          useQuery: true,
          useInfinite: false,
          useInfiniteQueryParam: 'page',
          options: {
            staleTime: 10000,
          },
        },
      },
    },
  },
});

