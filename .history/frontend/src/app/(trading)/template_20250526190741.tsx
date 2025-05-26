import React from 'react';
import { ToastContainer } from 'react-toastify';


export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="xl:h-screen p-4 bg-black-700">
      <main className="xl:h-full">
       <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover 
      />
        {children}
 
      </main>
    </div>
  );
}