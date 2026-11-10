import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GenealogyPage } from './pages/GenealogyPage';
import { LabPage } from './pages/LabPage';
import { RankingPage } from './pages/RankingPage';
import { EncyclopediaPage } from './pages/EncyclopediaPage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { MethodologyModal } from './components/MethodologyModal';
import type { RamenProduct } from './types/ramen';

function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState<RamenProduct | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSendToLab = (a: RamenProduct, b: RamenProduct) => {
    setSelectedProduct(null);
    navigate(`/lab?tab=custom&a=${a.id}&b=${b.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-stone-900 font-sans selection:bg-amber-200">
      {/* 1. Header & Navigation (4 Independent Pages) */}
      <Header onOpenMethodology={() => setIsMethodologyOpen(true)} />

      {/* 2. Independent Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<GenealogyPage onSelectProduct={setSelectedProduct} />} />
          <Route path="/lab" element={<LabPage onSelectProduct={setSelectedProduct} />} />
          <Route path="/ranking" element={<RankingPage onSelectProduct={setSelectedProduct} />} />
          <Route path="/encyclopedia" element={<EncyclopediaPage onSelectProduct={setSelectedProduct} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 3. Global Footer */}
      <Footer onOpenMethodology={() => setIsMethodologyOpen(true)} />

      {/* 4. Shared Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSendToLab={handleSendToLab}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
