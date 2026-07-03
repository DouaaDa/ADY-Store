import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';

const MediaGallery = ({ images = [], videos = [], featuredImage = null, featuredVideo = null }) => {
  // Combine all media into a unified list
  const allMedia = [
    ...(featuredImage ? [{ type: 'image', url: featuredImage, featured: true }] : []),
    ...(featuredVideo ? [{ type: 'video', url: featuredVideo, featured: true }] : []),
    ...images
      .filter((img) => img.url && img.url !== featuredImage)
      .map((img) => ({ type: 'image', url: img.url })),
    ...videos
      .filter((vid) => vid && vid !== featuredVideo)
      .map((vid) => ({ type: 'video', url: vid })),
  ];

  const mediaList = allMedia.length > 0
    ? allMedia
    : [{ type: 'image', url: '/assets/product_placeholder.png' }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [fullscreen, setFullscreen] = useState(false);
  const imageRef = useRef(null);
  const thumbsRef = useRef(null);

  const current = mediaList[activeIndex];

  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  const handlePrev = () => setActiveIndex((i) => (i === 0 ? mediaList.length - 1 : i - 1));
  const handleNext = () => setActiveIndex((i) => (i === mediaList.length - 1 ? 0 : i + 1));

  const scrollThumb = (index) => {
    setActiveIndex(index);
    if (thumbsRef.current) {
      const thumb = thumbsRef.current.children[index];
      if (thumb) thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  // Touch swipe support
  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 50) { delta > 0 ? handlePrev() : handleNext(); }
    touchStart.current = null;
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main Viewer */}
        <div
          className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-black/20 border border-white/10 aspect-square"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`media-${activeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex items-center justify-center p-6"
            >
              {current.type === 'video' ? (
                <video
                  src={current.url}
                  controls
                  className="w-full h-full object-contain rounded-xl"
                  playsInline
                />
              ) : (
                <div
                  ref={imageRef}
                  className={`w-full h-full flex items-center justify-center ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                  onMouseEnter={() => setZoomed(true)}
                  onMouseLeave={() => setZoomed(false)}
                  onMouseMove={handleMouseMove}
                  style={zoomed ? {
                    overflow: 'hidden',
                  } : {}}
                >
                  <motion.img
                    src={current.url}
                    alt="Product"
                    className="max-w-full max-h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] select-none"
                    style={zoomed ? {
                      transform: 'scale(2.2)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transition: 'transform-origin 0.1s',
                    } : { transform: 'scale(1)' }}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          {mediaList.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Top-right buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button
              onClick={() => setFullscreen(true)}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/80 transition-all"
              title="Plein écran"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            {current.type === 'image' && (
              <button
                onClick={() => setZoomed((z) => !z)}
                className={`w-8 h-8 rounded-full backdrop-blur border flex items-center justify-center transition-all ${
                  zoomed
                    ? 'bg-gaming-cyan/20 border-gaming-cyan/50 text-gaming-cyan'
                    : 'bg-black/60 border-white/10 text-gray-300 hover:text-white hover:bg-black/80'
                }`}
                title="Zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Index indicator */}
          {mediaList.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {mediaList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollThumb(i)}
                  className={`rounded-full transition-all ${
                    i === activeIndex
                      ? 'w-6 h-1.5 bg-gaming-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                      : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {mediaList.length > 1 && (
          <div
            ref={thumbsRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
          >
            {mediaList.map((media, i) => (
              <button
                key={i}
                onClick={() => scrollThumb(i)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  i === activeIndex
                    ? 'border-gaming-cyan shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {media.type === 'video' ? (
                  <div className="w-full h-full bg-black/50 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <img
                    src={media.url}
                    alt={`thumb-${i}`}
                    className="w-full h-full object-contain p-1 bg-white/5"
                    loading="lazy"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>
            {mediaList.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {current.type === 'video' ? (
                <video src={current.url} controls autoPlay className="max-w-full max-h-[85vh] rounded-xl" />
              ) : (
                <img
                  src={current.url}
                  alt="Product fullscreen"
                  className="max-w-full max-h-[85vh] object-contain rounded-xl"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MediaGallery;
