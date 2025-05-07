import { Route, Routes } from "react-router-dom";
import Layout from "./layout/layout";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import EventCreatePage from "./pages/EventCreatePage";
import ImpressumPage from "./pages/ImpressumPage";
import DatenschutzPage from "./pages/DatenschutzPage";
import EventEditPage from "./pages/EventEditPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="verein" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/events/new" element={<EventCreatePage />} />
        <Route path="/events/edit/:id" element={<EventEditPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/datenschutz" element={<DatenschutzPage />} />
      </Route>
    </Routes>
  );
}
