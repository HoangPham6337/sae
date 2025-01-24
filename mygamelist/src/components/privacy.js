import React from "react";
import "./global.css"; // Import du CSS

function PrivacyPage() {
  return (
    <div className="page-container">
      <h1>Politique de confidentialité</h1>
      <p>
        GameVerse s'engage à protéger la confidentialité de vos données personnelles. Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations.
      </p>
      <h2>1. Informations collectées</h2>
      <p>
        Nous collectons des informations personnelles telles que votre nom, adresse email, et informations de connexion lorsque vous créez un compte sur GameVerse. Nous pouvons également collecter des informations sur votre utilisation de notre plateforme pour améliorer nos services.
      </p>
      <h2>2. Utilisation des informations</h2>
      <p>
        Les informations que nous collectons sont utilisées pour personnaliser votre expérience sur GameVerse, vous envoyer des notifications importantes concernant votre compte, et améliorer nos services.
      </p>
      <h2>3. Partage des informations</h2>
      <p>
        Nous ne vendons pas vos informations à des tiers. Cependant, nous pouvons partager certaines données avec des partenaires de confiance pour améliorer nos services ou pour des raisons légales.
      </p>
      <h2>4. Sécurité</h2>
      <p>
        Nous mettons en place des mesures de sécurité pour protéger vos informations personnelles contre toute utilisation non autorisée ou perte.
      </p>
      <h2>5. Vos droits</h2>
      <p>
        Vous avez le droit d'accéder à vos informations, de les corriger ou de les supprimer. Vous pouvez également choisir de désactiver votre compte à tout moment.
      </p>
    </div>
  );
}

export default PrivacyPage;
