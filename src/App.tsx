import { MotionConfig } from 'motion/react'
import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
const CartPage = lazy(() => import('./pages/CartPage'))
import HomePage from './pages/HomePage'
const ListingPage = lazy(() => import('./pages/ListingPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))

const NotFound = lazy(() => import('./pages/NotFound'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const named = <K extends string>(key: K) => lazy(() => import('./pages/StaticPages').then((m) => ({ default: (m as unknown as Record<K, () => React.JSX.Element>)[key] })))
const OurStory = named('OurStory')
const Craft = named('Craft')
const Faq = named('Faq')
const Contact = named('Contact')
const Shipping = named('Shipping')
const Returns = named('Returns')
const CareGuide = named('CareGuide')
const Privacy = named('Privacy')
const Terms = named('Terms')

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="sarees" element={<ListingPage mode="all" />} />
              <Route path="collections/:slug" element={<ListingPage mode="collection" />} />
              <Route path="occasion/:slug" element={<ListingPage mode="occasion" />} />
              <Route path="saree/:slug" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="our-story" element={<OurStory />} />
              <Route path="craft" element={<Craft />} />
              <Route path="faq" element={<Faq />} />
              <Route path="contact" element={<Contact />} />
              <Route path="shipping" element={<Shipping />} />
              <Route path="returns" element={<Returns />} />
              <Route path="care-guide" element={<CareGuide />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </MotionConfig>
  )
}
