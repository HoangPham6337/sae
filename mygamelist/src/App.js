import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TopGames from "./components/TopGames.js";
import RankingsPage from "./components/RankingsPage.js"; // Page intermédiaire pour les classements
import Home from "./components/Home.js";
import LoginPage from "./components/LoginPage.js";
import RegisterPage from "./components/RegisterPage.js";
import ChangePasswordPage from "./components/ChangePasswordPage.js";
import AboutPage from "./components/about.js";
import TermsPage from "./components/terms.js";
import PrivacyPage from "./components/privacy.js";
import AccountInfo from "./components/AccountInfo.js";

function App() {
  useEffect(() => {
    // Empêche la fenêtre d'être redimensionnée sous 375px
    const enforceMinWidth = () => {
      if (window.innerWidth < 375) {
        document.body.style.minWidth = "375px";
      } else {
        document.body.style.minWidth = "";
      }
    };

    enforceMinWidth(); // Vérification initiale
    window.addEventListener("resize", enforceMinWidth);

    return () => {
      window.removeEventListener("resize", enforceMinWidth);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<Home />} />

          {/* Page intermédiaire des classements */}
          <Route path="/classement" element={<RankingsPage />} />

          {/* Route générique pour afficher les classements (genre, thème, développeur, éditeur, plateforme, etc.) */}
          <Route path="/classement/:type/:value" element={<TopGames />} />

          {/* Page des informations du compte */}
          <Route path="/account" element={<AccountInfo />} />

          {/* Authentification */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* Pages légales et d'information */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
