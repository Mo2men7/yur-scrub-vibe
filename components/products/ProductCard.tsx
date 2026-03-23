"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/lib/types";
import { formatPrice, getProductName } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations("products");

  return (
    <Link
      href={`/${locale}/products/${product.id}`}
      className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="product-img-wrap relative aspect-[4/5] overflow-hidden bg-muted">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={getProductName(product, locale)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="font-display text-4xl font-bold text-primary/20">
              ys
            </span>
          </div>
        )}

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="absolute bottom-3 start-3 flex gap-1.5">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="w-4 h-4 rounded-full border-2 border-white/80 shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="w-4 h-4 rounded-full bg-white/80 text-[9px] font-bold text-foreground flex items-center justify-center shadow-sm">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {getProductName(product, locale)}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <p className="font-bold text-primary">
            {formatPrice(product.price, locale)}
          </p>
          <span className="text-xs text-muted-foreground">
            {product.sizes?.join(" · ")}
          </span>
        </div>
      </div>
    </Link>
  );
}
