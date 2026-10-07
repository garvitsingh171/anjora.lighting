import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { Home } from './pages/Home'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProductDetail } from './pages/ProductDetail'
import { Products } from './pages/Products'
import { ProjectDetail } from './pages/ProjectDetail'
import { Projects } from './pages/Projects'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="research" element={<PlaceholderPage title="Research" />} />
        <Route path="blog" element={<PlaceholderPage title="Journal" />} />
        <Route path="about" element={<PlaceholderPage title="About Anjora" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
