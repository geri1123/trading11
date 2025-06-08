"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';


export const AuthContext = createContext(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
 
  return (
    <AuthContext.Provider value={{ }}>
      {children}
    </AuthContext.Provider>
  );
};