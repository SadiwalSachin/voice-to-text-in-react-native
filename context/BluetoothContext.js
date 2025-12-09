import React, { createContext, useState } from "react";

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const [connectedDevice, setConnectedDevice] = useState(null);

  return (
    <BluetoothContext.Provider value={{ connectedDevice, setConnectedDevice }}>
      {children}
    </BluetoothContext.Provider>
  );
};
