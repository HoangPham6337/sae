import React from "react";
import "./global.css"; // Import du CSS

function AboutPage() {
  return (
    <div className="page-container">
      <h1>À propos de GameVerse</h1>
      <p>
        GameVerse est une plateforme dédiée à la découverte, au suivi et à l'organisation de votre collection de jeux vidéo. Notre mission est de fournir une interface conviviale et intuitive pour les joueurs du monde entier, tout en créant une communauté qui partage une passion commune pour les jeux.
      </p>
      <h2>Notre histoire</h2>
      <p>
        Fondée en 2024, GameVerse a été créée par une équipe de développeurs et de passionnés de jeux vidéo qui voulaient offrir un moyen facile de gérer sa bibliothèque de jeux tout en permettant aux utilisateurs de découvrir de nouveaux titres et d’échanger avec d'autres joueurs. Nous croyons que chaque joueur mérite un espace où il peut s'épanouir, partager et se connecter autour de sa passion.
      </p>
      <h2>Nos valeurs</h2>
      <ul>
        <li><strong>Passion :</strong> Nous vivons et respirons le jeu vidéo.</li>
        <li><strong>Communauté :</strong> Nous mettons un point d'honneur à créer un espace inclusif et respectueux pour tous les joueurs.</li>
        <li><strong>Innovation :</strong> Nous sommes toujours à la recherche de nouvelles façons d'améliorer l'expérience de nos utilisateurs.</li>
        <li><strong>Accessibilité :</strong> Nous croyons que tout le monde mérite d'avoir accès à une plateforme de qualité, sans barrières.</li>
      </ul>
      <h2>Contactez-nous</h2>
      <p>
        Pour toute question ou suggestion, n’hésitez pas à nous contacter via nos différents réseaux.
      </p>
    </div>
  );
}

export default AboutPage;
