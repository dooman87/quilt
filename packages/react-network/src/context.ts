import React from 'react';
import {createUniversalProvider} from '@shopify/react-universal-provider';

import {NetworkManager} from './manager';

export const NetworkContext = React.createContext<NetworkManager | null>(null);

export const HeaderContext = React.createContext<Record<string, string>>({});
export const HeaderUniversalProvider = createUniversalProvider(
  'request-headers',
  HeaderContext,
);
