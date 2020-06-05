import React from 'react';
import {useLazyRef} from '@shopify/react-hooks';

import {useNetworkManager} from './hooks';
import {UniversalProvider, UniversalNetworkDetails} from './context';

interface Props {
  children?: React.ReactNode;
  headers: string[];
}

export function NetworkUniversalProvider({
  children,
  headers: headerNames,
}: Props) {
  const network = useNetworkManager();
  const universalDetails = useLazyRef<UniversalNetworkDetails | null>(() => {
    if (!network) {
      return null;
    }

    const result: UniversalNetworkDetails = {headers: {}};

    headerNames.forEach(header => {
      result.headers[header.toLowerCase()] = network.getHeader(header);
    });

    return result;
  });

  return (
    <UniversalProvider value={universalDetails.current}>
      {children}
    </UniversalProvider>
  );
}
