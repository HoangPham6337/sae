import json

# Nom du fichier JSON contenant les jeux vidéo
INPUT_FILE = "GamesDATA.json"
OUTPUT_FILE = "LastGamesDATA.json"

# Traductions pour d'autres champs (inchangées dans cette version)
# Traductions en français fournies
game_modes_fr = {
    'Battle Royale': 'Battle Royale',
    'Co-operative': 'Coopératif',
    'Massively Multiplayer Online (MMO)': 'Multijoueur en ligne massivement (MMO)',
    'Multiplayer': 'Multijoueur',
    'Single player': 'Solo',
    'Split screen': 'Écran partagé'
}

player_perspectives_fr = {
    'Auditory': 'Auditif',
    'Bird view / Isometric': 'Vue aérienne / Isométrique',
    'First person': 'Première personne',
    'Side view': 'Vue latérale',
    'Text': 'Texte',
    'Third person': 'Troisième personne',
    'Virtual Reality': 'Réalité virtuelle'
}

themes_fr = {
    '4X (explore, expand, exploit, and exterminate)': '4X (explorer, étendre, exploiter, exterminer)',
    'Action': 'Action',
    'Business': 'Commerce',
    'Comedy': 'Comédie',
    'Drama': 'Drame',
    'Educational': 'Éducatif',
    'Erotic': 'Érotique',
    'Fantasy': 'Fantaisie',
    'Historical': 'Historique',
    'Horror': 'Horreur',
    'Kids': 'Enfants',
    'Mystery': 'Mystère',
    'Non-fiction': 'Non-fiction',
    'Open world': 'Monde ouvert',
    'Party': 'Fête',
    'Romance': 'Romance',
    'Sandbox': 'Bac à sable',
    'Science fiction': 'Science-fiction',
    'Stealth': 'Infiltration',
    'Survival': 'Survie',
    'Thriller': 'Thriller',
    'Warfare': 'Guerre'
}

genres_fr = {
    'Adventure': 'Aventure',
    'Arcade': 'Arcade',
    'Card & Board Game': 'Jeu de cartes et de société',
    'Fighting': 'Combat',
    "Hack and slash/Beat 'em up": 'Hack and slash / Beat them up',
    'Indie': 'Indépendant',
    'MOBA': 'MOBA',
    'Music': 'Musique',
    'Pinball': 'Flipper',
    'Platform': 'Plateforme',
    'Point-and-click': 'Point-and-click',
    'Puzzle': 'Puzzle',
    'Quiz/Trivia': 'Quiz / Questions-réponses',
    'Racing': 'Course',
    'Real Time Strategy (RTS)': 'Stratégie en temps réel (RTS)',
    'Role-playing (RPG)': 'Jeu de rôle (RPG)',
    'Shooter': 'Tir',
    'Simulator': 'Simulation',
    'Sport': 'Sport',
    'Strategy': 'Stratégie',
    'Tactical': 'Tactique',
    'Turn-based strategy (TBS)': 'tour par tour (TBS)',
    'Visual Novel': 'Roman visuel'
}

# Fonction pour restructurer les données sans écraser les descriptions
def restructure_with_translations(file_path, output_file):
    try:
        # Chargement des données JSON
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        # Parcours des jeux pour les mettre à jour
        for game in data:
            # Conservation des descriptions existantes
            if "description" in game:
                if isinstance(game["description"], dict):  # Si description déjà structurée
                    game["description"] = {
                        "en": game["description"].get("en", ""),  # Copier la description anglaise
                        "fr": game["description"].get("fr", "")   # Copier la description française
                    }
                elif isinstance(game["description"], str):  # Si description est une simple chaîne
                    game["description"] = {"en": game["description"], "fr": ""}

            # Traduction des game_modes
            if "game_modes" in game:
                game["game_modes"] = {
                    "en": game["game_modes"],
                    "fr": [game_modes_fr.get(mode, mode) for mode in game["game_modes"]]
                }

            # Traduction des player_perspectives
            if "player_perspectives" in game:
                game["player_perspectives"] = {
                    "en": game["player_perspectives"],
                    "fr": [player_perspectives_fr.get(perspective, perspective)
                           for perspective in game["player_perspectives"]]
                }

            # Traduction des themes
            if "themes" in game:
                game["themes"] = {
                    "en": game["themes"],
                    "fr": [themes_fr.get(theme, theme) for theme in game["themes"]]
                }

            # Traduction des genres
            if "genres" in game:
                game["genres"] = {
                    "en": game["genres"],
                    "fr": [genres_fr.get(genre, genre) for genre in game["genres"]]
                }

        # Sauvegarde des données mises à jour
        with open(output_file, "w", encoding="utf-8") as file:
            json.dump(data, file, ensure_ascii=False, indent=4)

        print(f"Les données ont été restructurées et sauvegardées dans '{output_file}'.")

    except FileNotFoundError:
        print(f"Le fichier '{file_path}' n'a pas été trouvé.")
    except json.JSONDecodeError:
        print(f"Erreur de lecture du fichier JSON '{file_path}'.")

# Fonction principale
def main():
    restructure_with_translations(INPUT_FILE, OUTPUT_FILE)

if __name__ == "__main__":
    main()
