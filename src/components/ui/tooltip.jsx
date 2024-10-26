// src/components/ui/tooltip/Tooltip.js

import React, { useState, createContext, useContext } from 'react';

// Crear el contexto para Tooltip
const TooltipContext = createContext();

// TooltipProvider: Proveedor de contexto para gestionar visibilidad
export const TooltipProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <TooltipContext.Provider value={{ visible, setVisible }}>
      {children}
    </TooltipContext.Provider>
  );
};

// TooltipTrigger: Elemento que activará el tooltip
export const TooltipTrigger = ({ children }) => {
  const { setVisible } = useContext(TooltipContext);

  return (
    <div
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="cursor-pointer"
    >
      {children}
    </div>
  );
};

// TooltipContent: Contenido del tooltip que aparece al hacer hover
export const TooltipContent = ({ children }) => {
  const { visible } = useContext(TooltipContext);

  return (
    visible && (
      <div className="absolute z-10 p-2 text-sm text-white bg-gray-800 rounded shadow-md">
        {children}
      </div>
    )
  );
};

// Tooltip: Componente contenedor para facilitar su uso
export const Tooltip = ({ children }) => (
  <TooltipProvider>{children}</TooltipProvider>
);