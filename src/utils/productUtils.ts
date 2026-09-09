import { Product } from '../types/ecommerce';

/**
 * Returns the best display image URL for a product.
 * Prioritizes custom uploaded photos (e.g. from Firebase Storage),
 * then custom image fields, then permanent URL paths.
 */
export function getProductDisplayImage(product: Product | null | undefined): string | undefined {
  if (!product) return undefined;

  // 1. Check customImages array (with mainImageIndex preference)
  if (Array.isArray(product.customImages) && product.customImages.length > 0) {
    const idx =
      typeof product.mainImageIndex === 'number' &&
      product.mainImageIndex >= 0 &&
      product.mainImageIndex < product.customImages.length
        ? product.mainImageIndex
        : 0;
    const img = product.customImages[idx] || product.customImages[0];
    if (img && typeof img === 'string' && img.trim()) {
      return img.trim();
    }
  }

  // 2. Check direct imageUrl field
  if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim()) {
    return product.imageUrl.trim();
  }

  // 3. Check images.front if it contains a URL or path
  if (
    product.images?.front &&
    typeof product.images.front === 'string' &&
    (product.images.front.startsWith('http://') ||
      product.images.front.startsWith('https://') ||
      product.images.front.startsWith('/api/') ||
      product.images.front.startsWith('data:'))
  ) {
    return product.images.front.trim();
  }

  return undefined;
}
