'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchGalleryImages } from '@/redux/thunks/galleryAndTestimonialThunks';
import { Loader2, ZoomIn } from 'lucide-react';

export default function GalleryPage() {
  const dispatch = useAppDispatch();
  const { images, loading } = useAppSelector((state) => state.gallery);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<(typeof images)[0] | null>(null);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchGalleryImages());
  }, [dispatch]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Photo Gallery</h1>
            <p className="text-lg text-muted-foreground">
              Capturing moments of joy and change in our community
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No images in the gallery yet</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group overflow-hidden rounded-lg bg-muted aspect-square cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                      <p className="text-white text-sm font-medium">{image.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Image Modal */}
              {selectedImage && (
                <div
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                  onClick={() => setSelectedImage(null)}
                >
                  <div className="relative max-w-3xl w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-10 right-0 text-white text-2xl"
                    >
                      ✕
                    </button>
                    <img
                      src={selectedImage.image_url}
                      alt={selectedImage.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="mt-4 text-center text-white">
                      <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
                      {selectedImage.description && (
                        <p className="text-sm text-gray-300 mt-2">{selectedImage.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
