"use client";

import { useState, useRef, useEffect, InputHTMLAttributes } from "react";

export interface Option {
  value: string;
  label: string;
}

interface AutoCompleteProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onSelect"> {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: Option) => void;
  placeholder?: string;
}

export function AutoComplete({
  options,
  value = "",
  onChange,
  onSelect,
  placeholder,
  ...props
}: AutoCompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (value == null) {
      setFilteredOptions(options);
      return;
    }

    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [value, options]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedListItem = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedListItem) {
        highlightedListItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange?.(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = (option: Option) => {
    onChange?.(option.value);
    onSelect?.(option);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredOptions.length === 0) {
      if (event.key === "ArrowDown" || event.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((previousIndex) =>
          previousIndex < filteredOptions.length - 1 ? previousIndex + 1 : previousIndex
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((previousIndex) => (previousIndex > 0 ? previousIndex - 1 : -1));
        break;
      case "Enter":
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!listRef.current?.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        {...props}
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete="off"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            padding: 0,
            listStyle: "none",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                backgroundColor:
                  index === highlightedIndex ? "#f0f0f0" : "transparent",
                borderBottom:
                  index < filteredOptions.length - 1 ? "1px solid #eee" : "none",
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

