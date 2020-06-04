import {useContext} from 'react';
import {parse, Language} from 'accept-language-parser';
import {CspDirective, StatusCode, Header} from '@shopify/network';
import {useServerEffect} from '@shopify/react-effect';
import {getSerialized} from '@shopify/react-html';
import {useLazyRef} from '@shopify/react-hooks';

import {NetworkContext} from './context';
import {NetworkManager} from './manager';

export function useNetworkEffect(perform: (network: NetworkManager) => void) {
  const network = useContext(NetworkContext);

  useServerEffect(
    () => {
      if (network != null) {
        return perform(network);
      }
    },
    network ? network.effect : undefined,
  );
}

export function useCspDirective(
  directive: CspDirective,
  source: string | string[] | boolean,
) {
  useNetworkEffect(network => network.addCspDirective(directive, source));
}

export function useRequestHeader(header: string) {
  const network = useContext(NetworkContext);

  const ref = useLazyRef(() => {
    if (network) {
      // Server: get it from context
      // It should also store/serialize it for later client-side renders
      return network.getHeader(header);
    } else {
      // Client: get it from serialized data
      // If not present (i.e. component was not initially rendered on server) return undefined
      try {
        return (getSerialized('request-headers') as {})[header.toLowerCase()];
      } catch {
        return undefined;
      }
    }
  });

  return ref.current;
}

export function useHeader(header: string, value: string) {
  useNetworkEffect(network => network.setHeader(header, value));
}

export function useNetworkManager() {
  return useContext(NetworkContext);
}

export function useStatus(code: StatusCode) {
  useNetworkEffect(network => network.addStatusCode(code));
}

export function useRedirect(url: string, status?: StatusCode) {
  useNetworkEffect(network => network.redirectTo(url, status));
}

export function useAcceptLanguage(
  fallback: Language = {code: 'en', quality: 1.0},
) {
  const acceptsLanguages = useRequestHeader(Header.AcceptLanguage);
  const locales = acceptsLanguages ? parse(acceptsLanguages) : [fallback];

  return locales;
}
