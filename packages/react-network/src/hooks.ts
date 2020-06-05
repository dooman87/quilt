import {useContext} from 'react';
import {parse, Language} from 'accept-language-parser';
import {CspDirective, StatusCode, Header} from '@shopify/network';
import {useServerEffect} from '@shopify/react-effect';

import {NetworkContext, UniversalContext} from './context';
import {NetworkManager} from './manager';

const NO_NETWORK_DETAILS_ERROR = [
  'Could not find react-network details.',
  'Either `<NetworkContext.Provider />` or `<NetworkUniversalProvider />` is likely',
  'missing in your application component tree.',
].join(' ');

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
  const manager = useNetworkManager();
  const details = useContext(UniversalContext);

  if (manager) {
    // Server-side: get it directly from network context
    return manager.getHeader(header);
  } else if (details) {
    // Client-side: get it from serialized universal context
    return details.headers[header.toLowerCase()];
  } else {
    // No server-side network context and no universal context provider
    throw new Error(NO_NETWORK_DETAILS_ERROR);
  }
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
