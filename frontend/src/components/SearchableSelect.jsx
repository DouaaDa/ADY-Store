import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Check, X } from 'lucide-react';

const SearchableSelect = ({ 
  options = [], 
  value = '', 
  onChange, 
  placeholder = 'Sélectionner...', 
  label, 
  error,
  disabled = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search query when dropdown opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => 
    typeof opt === 'string' ? opt === value : opt.value === value
  );

  const displayValue = selectedOption 
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label)
    : '';

  const filteredOptions = options.filter(opt => {
    const text = typeof opt === 'string' ? opt : `${opt.label} ${opt.searchHelper || ''}`;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
          {label} {required && <span className="text-gaming-pink">*</span>}
        </label>
      )}
      
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-black/40 border rounded-xl py-3.5 px-4 text-sm text-white flex items-center justify-between cursor-pointer transition-all duration-300
          ${isOpen ? 'border-gaming-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'border-white/10 hover:border-white/20'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          ${error ? 'border-red-500/50 hover:border-red-500' : ''}
        `}
      >
        <span className={displayValue ? 'text-white' : 'text-gray-600'}>
          {displayValue || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gaming-cyan' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-gaming-surface/95 border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden max-h-72 flex flex-col"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-white/5 relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full bg-black/40 border border-white/5 rounded-lg py-2 pl-10 pr-8 text-xs text-white focus:outline-none focus:border-gaming-blue/50"
                onClick={e => e.stopPropagation()}
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Options List */}
            <div className="overflow-y-auto py-2 flex-grow scrollbar-thin">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, index) => {
                  const val = typeof opt === 'string' ? opt : opt.value;
                  const labelStr = typeof opt === 'string' ? opt : opt.label;
                  const isSelected = val === value;

                  return (
                    <div
                      key={index}
                      onClick={() => handleSelect(val)}
                      className={`px-5 py-3 text-xs text-left cursor-pointer flex items-center justify-between transition-colors
                        ${isSelected ? 'bg-gaming-blue/10 text-gaming-cyan font-bold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}
                      `}
                    >
                      <span>{labelStr}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-gaming-cyan" />}
                    </div>
                  );
                })
              ) : (
                <div className="py-6 px-4 text-xs text-gray-500 text-center">
                  Aucun résultat trouvé
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
};

export default SearchableSelect;
