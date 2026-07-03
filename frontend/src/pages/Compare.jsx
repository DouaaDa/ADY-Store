import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { removeFromCompare, clearCompare } from "../store/compareSlice";
import { addToCart } from "../store/cartSlice";
import {
  GitCompare, X, ShoppingCart, Star, Package,
  CheckCircle2, XCircle, ArrowLeft, Trash2, Eye
} from "lucide-react";

const Row = ({ label, children, highlight }) => (
  <div
    className={"grid gap-4 py-3 px-2 rounded-xl transition-colors " + (highlight ? "bg-white/[0.03]" : "")}
    style={{ gridTemplateColumns: `160px repeat(${React.Children.count(children)}, 1fr)` }}
  >
    <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
      {label}
    </div>
    {children}
  </div>
);

const Cell = ({ children }) => (
  <div className="flex items-center justify-center text-center text-sm text-gray-200">
    {children}
  </div>
);

const BoolCell = ({ value }) => (
  <div className="flex items-center justify-center">
    {value
      ? <CheckCircle2 size={18} style={{ color: "#00ff88" }} />
      : <XCircle size={18} style={{ color: "#ef444488" }} />}
  </div>
);

const RatingStars = ({ rating }) => (
  <div className="flex items-center justify-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star
        key={i}
        size={13}
        fill={i <= Math.round(rating) ? "#eab308" : "none"}
        style={{ color: "#eab308" }}
      />
    ))}
    <span className="text-xs text-gray-400 ml-1">{Number(rating).toFixed(1)}</span>
  </div>
);

const Compare = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.compare);
  const { user } = useSelector((s) => s.auth);

  const handleAddToCart = (product) => {
    if (!user) { navigate("/login"); return; }
    dispatch(addToCart(product));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm"
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg,#00e5ff15,#b026ff15)", border: "1px solid #00e5ff33" }}
          >
            <GitCompare size={40} style={{ color: "#00e5ff" }} />
          </div>
          <h1 className="text-2xl font-black text-white mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Aucun produit à comparer
          </h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Ajoutez entre 2 et 4 produits à la comparaison depuis la boutique pour les visualiser ici côte à côte.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #00e5ff, #b026ff)", color: "#fff" }}
          >
            <ArrowLeft size={16} /> Parcourir la boutique
          </Link>
        </motion.div>
      </div>
    );
  }

  const colCount = items.length;

  return (
    <div className="min-h-screen px-4 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={13} /> Retour aux produits
          </Link>
          <h1 className="text-2xl font-black text-white flex items-center gap-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
            <GitCompare size={22} style={{ color: "#00e5ff" }} />
            Comparaison ({colCount} produit{colCount > 1 ? "s" : ""})
          </h1>
        </div>
        <button
          onClick={() => dispatch(clearCompare())}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
        >
          <Trash2 size={15} /> Vider la comparaison
        </button>
      </motion.div>

      {/* Main comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="overflow-x-auto"
      >
        <div className="min-w-[600px]">

          {/* Product cards row */}
          <div
            className="grid gap-4 mb-4"
            style={{ gridTemplateColumns: `160px repeat(${colCount}, 1fr)` }}
          >
            <div /> {/* empty label column */}
            {items.map((product, idx) => {
              const img = product.images?.[0]?.url || product.media?.[0]?.url;
              const hasDiscount = product.promotionalPrice && product.promotionalPrice < product.price;
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.07 } }}
                  className="relative rounded-2xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {/* Remove button */}
                  <button
                    onClick={() => dispatch(removeFromCompare(product._id))}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
                  >
                    <X size={13} style={{ color: "#ef4444" }} />
                  </button>

                  {/* Image */}
                  <div className="h-48 flex items-center justify-center p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                    {img ? (
                      <img src={img} alt={product.name} className="h-full w-full object-contain" />
                    ) : (
                      <Package size={48} className="text-gray-700" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{product.brand}</p>
                    <Link
                      to={`/product/${product._id}`}
                      className="text-sm font-bold text-white hover:text-cyan-400 transition-colors leading-tight line-clamp-2 block mb-3"
                    >
                      {product.name}
                    </Link>

                    {/* Price */}
                    <div className="mb-3">
                      {hasDiscount ? (
                        <>
                          <span className="text-lg font-black" style={{ color: "#00e5ff" }}>
                            {product.promotionalPrice.toLocaleString("fr-DZ")} DA
                          </span>
                          <span className="text-xs text-gray-500 line-through ml-2">
                            {product.price.toLocaleString("fr-DZ")} DA
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-black text-white">
                          {product.price.toLocaleString("fr-DZ")} DA
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                        style={{ background: "linear-gradient(135deg, #00e5ff22, #b026ff22)", border: "1px solid #00e5ff44", color: "#00e5ff" }}
                      >
                        <ShoppingCart size={13} /> Panier
                      </button>
                      <Link
                        to={`/product/${product._id}`}
                        className="flex items-center justify-center p-2 rounded-xl transition-all hover:scale-105"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
                      >
                        <Eye size={13} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t mb-2" style={{ borderColor: "rgba(255,255,255,0.06)" }} />

          {/* Specs rows */}
          <div className="space-y-0.5">
            <Row label="Catégorie" highlight>
              {items.map(p => <Cell key={p._id}>{p.category?.name || "—"}</Cell>)}
            </Row>
            <Row label="Marque">
              {items.map(p => <Cell key={p._id}>{p.brand || "—"}</Cell>)}
            </Row>
            <Row label="Note" highlight>
              {items.map(p => <Cell key={p._id}><RatingStars rating={p.rating || 0} /></Cell>)}
            </Row>
            <Row label="Avis">
              {items.map(p => <Cell key={p._id}>{p.numReviews || 0} avis</Cell>)}
            </Row>
            <Row label="Stock" highlight>
              {items.map(p => (
                <Cell key={p._id}>
                  <span style={{ color: p.countInStock > 0 ? "#00ff88" : "#ef4444" }}>
                    {p.countInStock > 0 ? `${p.countInStock} unités` : "Rupture"}
                  </span>
                </Cell>
              ))}
            </Row>
            <Row label="En vedette">
              {items.map(p => <BoolCell key={p._id} value={p.isFeatured} />)}
            </Row>
            <Row label="Populaire" highlight>
              {items.map(p => <BoolCell key={p._id} value={p.isPopular} />)}
            </Row>
            <Row label="Promotion">
              {items.map(p => <BoolCell key={p._id} value={!!(p.promotionalPrice && p.promotionalPrice < p.price)} />)}
            </Row>
            {/* Variants */}
            <Row label="Variantes" highlight>
              {items.map(p => (
                <Cell key={p._id}>
                  {p.variants && p.variants.length > 0
                    ? <span className="text-xs">{p.variants.map(v => v.color).join(", ")}</span>
                    : <span className="text-gray-600">—</span>}
                </Cell>
              ))}
            </Row>
            {/* Features */}
            {items.some(p => p.features && p.features.length > 0) && (
              <Row label="Caractéristiques">
                {items.map(p => (
                  <Cell key={p._id}>
                    <ul className="text-xs text-left space-y-1 text-gray-400">
                      {(p.features || []).slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span style={{ color: "#00e5ff", marginTop: 2 }}>·</span> {f}
                        </li>
                      ))}
                      {(p.features || []).length === 0 && <li className="text-gray-600">—</li>}
                    </ul>
                  </Cell>
                ))}
              </Row>
            )}
          </div>

          {/* Bottom CTA */}
          <div
            className="mt-6 grid gap-4"
            style={{ gridTemplateColumns: `160px repeat(${colCount}, 1fr)` }}
          >
            <div />
            {items.map(product => (
              <motion.button
                key={product._id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAddToCart(product)}
                className="py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #00e5ff, #b026ff)",
                  color: "#fff",
                  boxShadow: "0 0 20px rgba(0,229,255,0.2)"
                }}
              >
                <ShoppingCart size={16} /> Ajouter au panier
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Compare;
