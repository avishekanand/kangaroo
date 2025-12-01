import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PracticeConfig } from './pages/PracticeConfig';
import { Quiz } from './pages/Quiz';
import { SessionSummary } from './pages/SessionSummary';
import { OlympiadLanding } from './pages/OlympiadLanding';

import { CategoryPage } from './pages/CategoryPage';
import { ProfilePage } from './pages/ProfilePage';

import { UserProvider } from './context/UserContext';
import { Header } from './components/Header';

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:categoryId" element={<CategoryPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/practice" element={<PracticeConfig />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/summary" element={<SessionSummary />} />
                    <Route path="/olympiad" element={<OlympiadLanding />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;
