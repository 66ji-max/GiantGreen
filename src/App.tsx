/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Jyanty from './pages/Jyanty';
import ForHotels from './pages/ForHotels';
import Demo from './pages/Demo';
import About from './pages/About';
import Contact from './pages/Contact';
import LegalPage from './pages/LegalPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="jyanty" element={<Jyanty />} />
        <Route path="for-hotels" element={<ForHotels />} />
        <Route path="demo" element={<Demo />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<LegalPage title="Privacy Policy" />} />
        <Route path="terms" element={<LegalPage title="Terms of Use" />} />
        <Route path="cookies" element={<LegalPage title="Cookie Notice" />} />
      </Route>
    </Routes>
  );
}
