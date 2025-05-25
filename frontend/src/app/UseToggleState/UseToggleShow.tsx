import { useState, useRef, useEffect } from "react";

export const useToggleShow = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const dropdownref = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      setIsOpen(true);
    }
  };

  const closeDropdown = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 500);
  };
  
  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      if (dropdownref.current && !dropdownref.current.contains(event.target  as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return { isOpen, isClosing, setIsOpen ,toggleDropdown, closeDropdown, dropdownref };
};