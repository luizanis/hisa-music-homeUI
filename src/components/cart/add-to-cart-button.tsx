import { Check, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useCartDrawer } from "@/components/cart/cart-drawer";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { ProductSnapshot } from "@/lib/cart";
import { cartActions, useCart } from "@/lib/member-store";

type AddToCartButtonProps = {
  product: ProductSnapshot;
  size?: ButtonProps["size"];
  className?: string;
};

/** Adds a course or pack to the shared cart once; a second click opens the cart. */
export const AddToCartButton = ({ product, size = "lg", className }: AddToCartButtonProps) => {
  const { t } = useTranslation();
  const cart = useCart();
  const { open } = useCartDrawer();
  const inCart = cart.items.some((item) => item.slug === product.slug);

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      className={className}
      onClick={() => {
        if (!inCart) cartActions.add(product);
        open();
      }}
    >
      {inCart ? (
        <Check aria-hidden strokeWidth={1.5} />
      ) : (
        <ShoppingCart aria-hidden strokeWidth={1.5} />
      )}
      {inCart ? t("cart.inCart") : t("cart.add")}
    </Button>
  );
};
