import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const VariantSelector = ({ variants = [], selectedVariant, onSelect }) => {
  if (!variants || variants.length === 0) return null;

  const getStockStatus = (variant) => {
    const stock = variant.stock ?? variant.countInStock ?? 0;
    if (stock === 0) return { label: 'Rupture', color: 'text-red-400', icon: XCircle };
    if (stock <= 5) return { label: `${stock} restants`, color: 'text-yellow-400', icon: AlertCircle };
    return { label: 'En stock', color: 'text-green-400', icon: CheckCircle2 };
  };

  const isSelected = (variant) => {
    if (!selectedVariant) return false;
    if (variant._id && selectedVariant._id) return variant._id === selectedVariant._id;
    return variant.color === selectedVariant.color;
  };

  const isOutOfStock = (variant) => {
    return (variant.stock ?? variant.countInStock ?? 0) === 0;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-300">
          Couleur :{' '}
          <span className="text-white">
            {selectedVariant?.color || variants[0]?.color || '—'}
          </span>
        </p>
        {selectedVariant && (() => {
          const status = getStockStatus(selectedVariant);
          const Icon = status.icon;
          return (
            <span className={`flex items-center gap-1 text-xs font-bold ${status.color}`}>
              <Icon className="w-3.5 h-3.5" />
              {status.label}
            </span>
          );
        })()}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant, index) => {
          const selected = isSelected(variant);
          const outOfStock = isOutOfStock(variant);
          const colorHex = variant.colorHex || variant.hex || '#888888';

          return (
            <motion.button
              key={variant._id || index}
              whileHover={!outOfStock ? { scale: 1.1 } : {}}
              whileTap={!outOfStock ? { scale: 0.95 } : {}}
              onClick={() => !outOfStock && onSelect(variant)}
              disabled={outOfStock}
              className={`relative w-10 h-10 rounded-full transition-all duration-200 ${
                outOfStock ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
              } ${
                selected
                  ? 'ring-2 ring-gaming-cyan ring-offset-2 ring-offset-gaming-bg shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                  : 'ring-1 ring-white/20 hover:ring-white/50'
              }`}
              title={`${variant.color}${outOfStock ? ' (Rupture)' : ''}`}
            >
              <span
                className="absolute inset-1 rounded-full"
                style={{ backgroundColor: colorHex }}
              />
              {outOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-0.5 h-8 bg-white/60 rotate-45 absolute rounded-full" />
                </span>
              )}
              {selected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gaming-cyan rounded-full flex items-center justify-center shadow-lg"
                >
                  <CheckCircle2 className="w-3 h-3 text-black" />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected variant details */}
      {selectedVariant && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-2 gap-2 mt-2"
        >
          {selectedVariant.sku && (
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-500 font-bold uppercase">SKU</p>
              <p className="text-xs text-gray-200 font-mono">{selectedVariant.sku}</p>
            </div>
          )}
          {selectedVariant.barcode && (
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Code-barres</p>
              <p className="text-xs text-gray-200 font-mono">{selectedVariant.barcode}</p>
            </div>
          )}
          {selectedVariant.weight && (
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Poids</p>
              <p className="text-xs text-gray-200">{selectedVariant.weight}</p>
            </div>
          )}
          {selectedVariant.warranty && (
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Garantie</p>
              <p className="text-xs text-gray-200">{selectedVariant.warranty}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Variant specs */}
      {selectedVariant?.specifications && Object.keys(selectedVariant.specifications).length > 0 && (
        <div className="space-y-1 mt-1">
          <p className="text-[10px] font-orbitron font-black text-gray-500 uppercase tracking-wider">Spécifications</p>
          <div className="grid grid-cols-1 gap-1">
            {Object.entries(selectedVariant.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs bg-white/3 rounded px-3 py-1.5">
                <span className="text-gray-500">{key}</span>
                <span className="text-gray-200 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantSelector;
