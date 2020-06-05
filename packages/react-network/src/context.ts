import React from 'react';
import {createUniversalProvider} from '@shopify/react-universal-provider';

import {NetworkManager} from './manager';

export const NetworkContext = React.createContext<NetworkManager | null>(null);

export interface UniversalNetworkDetails {
  headers: Record<string, string>;
}
export const UniversalContext = React.createContext<UniversalNetworkDetails | null>(
  null,
);
export const UniversalProvider = createUniversalProvider(
  'network-details',
  UniversalContext,
);
