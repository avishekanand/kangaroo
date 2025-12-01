import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PracticeConfig } from './pages/PracticeConfig';
import { Quiz } from './pages/Quiz';
import { SessionSummary } from './pages/SessionSummary';
import { OlympiadLanding } from './pages/OlympiadLanding';

import { CategoryPage } from './pages/CategoryPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/practice" element={<PracticeConfig />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/summary" element={<SessionSummary />} />
                <Route path="/olympiad" element={<OlympiadLanding />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
