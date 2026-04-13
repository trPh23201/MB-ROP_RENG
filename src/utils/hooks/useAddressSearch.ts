import * as Crypto from 'expo-crypto';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppError } from '../../core/errors/AppErrors';
import { IAddressSuggestion } from '../../domain/shared/types';
import { GoongGeocodingRepository } from '../../infrastructure/repositories/GoongGeocodingRepository';
import { popupService } from '../../presentation/layouts/popup/PopupService';

const repository = new GoongGeocodingRepository();

export const useAddressSearch = () => {
  const [suggestions, setSuggestions] = useState<IAddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionToken = useRef<string>("");

  const refreshSessionToken = useCallback(() => {
    sessionToken.current = Crypto.randomUUID();
  }, []);

  useEffect(() => {
    refreshSessionToken();
  }, [refreshSessionToken]);

  const onSearch = useCallback((text: string) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (!text || text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    debounceTimeout.current = setTimeout(async () => {
      try {
        const results = await repository.searchAddress(text, sessionToken.current);
        setSuggestions(results);

      } catch (error: unknown) {
        setSuggestions([]);
        if (error instanceof AppError && error.code === 'QUOTA_EXCEEDED') {
          popupService.alert(error.message, { title: 'Thông báo' });
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  const onSelectAddress = useCallback((item: IAddressSuggestion) => {
    setSuggestions([]);
    return item;
  }, []);

  return {
    suggestions,
    isLoading,
    onSearch,
    onSelectAddress,
    sessionToken: sessionToken.current,
    refreshSessionToken
  };
};