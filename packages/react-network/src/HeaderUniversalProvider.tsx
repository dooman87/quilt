import React from 'react';
import {useLazyRef} from '@shopify/react-hooks';

import {useNetworkManager} from './hooks';
import {HeaderUniversalProvider as UniversalProvider} from './context';

interface Props {
  children?: React.ReactNode;
  headers: string[];
}

export function HeaderUniversalProvider({
  children,
  headers: headerNames,
}: Props) {
  const network = useNetworkManager();
  const headers = useLazyRef(() => {
    const result = {};

    if (network) {
      headerNames.forEach(header => {
        result[header.toLowerCase()] = network.getHeader(header);
      });
    }

    return result;
  });

  return (
    <UniversalProvider value={headers.current}>{children}</UniversalProvider>
  );
}
