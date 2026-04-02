'use client';

import { createContext, useContext } from 'react';
import type { OccasionType } from '@/lib/types';

const OccasionContext = createContext<OccasionType>('couple');

export function OccasionProvider({
  siteType,
  children,
}: {
  siteType: OccasionType;
  children: React.ReactNode;
}) {
  return <OccasionContext.Provider value={siteType}>{children}</OccasionContext.Provider>;
}

export function useOccasionType() {
  return useContext(OccasionContext);
}