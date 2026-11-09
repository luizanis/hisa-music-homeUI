# Roadmap — Enter migration, Phase 1: student area consolidation
- [ ] Enter student layout + shared helpers (account, notifications) on real sign-in only (no demo mode)
- [ ] One shared cart: header drawer, add-to-cart, /cart, /checkout
- [ ] Routes /pt|/en: dashboard, account, my-courses, my-library, my-orders, my-orders/:orderId, notifications, cart, courses/:courseId/learn, certificate/:courseId, order-confirmation/:orderId
- [ ] Remove replaced earlier member pages; keep order detail page
- [ ] Import Enter student translations (keep bio, homepage, public copy)
- [ ] Validate: checks, both languages, cart, signed-out redirect, homepage unchanged
- Admin area: NOT in Phase 1

# (Superseded) Phase 01 member area — note: forgot-password page, cart checkout and course player were never actually built

- [x] Forgot password page (/forgot-password), linked from sign-in
- [x] Header: cart icon with count + profile icon / account menu
- [x] Shared cart (Academy + Sounds), drawer, no duplicates, coupon mock
- [x] Cart checkout (/checkout) + single-product checkout kept, simulated outcome
- [x] Order confirmation (paid / pending / failed)
- [x] Member layout: sidebar (desktop), section strip (mobile)
- [x] Dashboard, My Account, My Courses, My Library, My Orders (+ detail)
- [x] Course player (/courses/:id/learn)
- [x] pt + en translations for everything
- [x] Tests for cart rules and order access

## Later (needs backend)
- Real orders, payments (Mercado Pago + webhook), course progress, file delivery, video hosting, profile saving, email notifications
