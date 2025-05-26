import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import LostItemsPage from './pages/LostItemsPage';
import FoundItemsPage from './pages/FoundItemsPage';
import SearchPage from './pages/SearchPage';
import MyPostsPage from './pages/MyPostsPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import NewItemPage from './pages/NewItemPage';
import EditItemPage from './pages/EditItemPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="lost" element={<LostItemsPage />} />
            <Route path="found" element={<FoundItemsPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="myposts" element={<MyPostsPage />} />
            <Route path="item/:id" element={<ItemDetailsPage />} />
            <Route path="new" element={<NewItemPage />} />
            <Route path="edit/:id" element={<EditItemPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;