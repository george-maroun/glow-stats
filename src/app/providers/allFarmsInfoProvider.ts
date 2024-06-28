import { createContext, useContext } from 'react';

export const FarmsInfoContext = createContext<any>(null);

export const useFarmsInfo = () => useContext(FarmsInfoContext);