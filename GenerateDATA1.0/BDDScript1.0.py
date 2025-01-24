import requests
import json
import os
import time

API_KEY = "METTRE_LA_CLEF_D'API_ATTENTION_NE_PAS_LA_PARTAGER"##crer un compte sur rawg.io pour avoir une clef d'API gratuite avec 20 000 utilisation gratuites.
BASE_URL = "https://api.rawg.io/api/games"
JSON_FILE = "Gamesdata_20000.json"
PAGE_TRACKER = "last_page.txt"

MAX_PAGES =500   # Nombre maximum de pages à récupérer

# Charger la dernière page consultée
def load_last_page():
    if os.path.exists(PAGE_TRACKER):
        with open(PAGE_TRACKER, "r") as f:
            return int(f.read())
    return 0  # Reprendre à la page 0 si le fichier n'existe pas

# Sauvegarder la dernière page consultée
def save_last_page(page):
    with open(PAGE_TRACKER, "w") as f:
        f.write(str(page))

# Charger les données JSON existantes ou retourner une liste vide
def load_existing_data():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

# Sauvegarder les données mises à jour dans le fichier JSON
def save_data(data):
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# Récupérer les données de l'API et extraire uniquement les informations nécessaires
def fetch_games(page):
    params = {
        "key": API_KEY,
        "page": page,
        "page_size": 40,  # 40 jeux par page (max autorisé)
        "ordering": "-rating"  # Trier par popularité (note la plus élevée en premier)
    }
    response = requests.get(BASE_URL, params=params)
    if response.status_code != 200:
        print(f"Erreur API : {response.status_code}")
        return []

    games = response.json().get("results", [])
    formatted_games = []

    for game in games:
        # Extraire les informations pertinentes
        formatted_game = {
            "name": game.get("name"),
            "developer": game.get("developers")[0]["name"] if game.get("developers") else "Unknown",
            "publisher": game.get("publishers")[0]["name"] if game.get("publishers") else "Unknown",
            "release_date": game.get("released", "Unknown"),
            "platforms": [platform["platform"]["name"] for platform in game.get("platforms", [])],
            "genres": [genre["name"] for genre in game.get("genres", [])],
            "logo_url": game.get("background_image"),
            "ratings": [
                {"title": rating["title"], "percent": rating["percent"]} 
                for rating in game.get("ratings", [])
            ],
            "players_count": game.get("players_count", "Unknown"),  # Nombre de joueurs
            "user_ratings_count": game.get("ratings_count", 0),  # Nombre d'évaluations des utilisateurs
            "game_url": game.get("url"),  # URL du jeu
            "description": game.get("description_raw", "No description available"),  # Description courte
            "rating": game.get("rating", "Unknown"),  # Note générale
            "vr_support": game.get("vr_support", "No VR support"),  # Support VR
            "languages": game.get("languages", []),  # Langues disponibles
            "engine": game.get("engine", "Unknown"),  # Moteur de jeu
            "media": game.get("media", []),  # Liens vers des médias associés
            "community_link": game.get("community_url", "No community link"),  # Lien vers la communauté
        }
        formatted_games.append(formatted_game)

    return formatted_games

# Récupération incrémentale des jeux sans doublons
def update_game_data():
    # Charger la dernière page et les données existantes
    last_page = load_last_page()
    print(f"Reprise à la page {last_page + 1}")
    existing_data = load_existing_data()

    # Créer un ensemble d'IDs pour les jeux existants
    existing_names = {game["name"] for game in existing_data}

    for page in range(last_page + 1, MAX_PAGES + 1):
        print(f"Récupération de la page {page}")
        
        # Récupérer les nouveaux jeux depuis l'API
        new_games = fetch_games(page)

        if not new_games:
            print(f"Fin des résultats ou problème avec l'API à la page {page}.")
            break  # On arrête si aucune donnée n'est retournée

        # Filtrer les nouveaux jeux pour éviter les doublons
        filtered_games = [game for game in new_games if game["name"] not in existing_names]

        # Fusionner les données existantes avec les nouvelles
        existing_data.extend(filtered_games)

        # Sauvegarder les données mises à jour et la nouvelle dernière page
        save_data(existing_data)
        save_last_page(page)

        print(f"{len(filtered_games)} nouveaux jeux ajoutés à la page {page}. Total : {len(existing_data)} jeux.")

        # Attendre un peu avant de faire la prochaine requête pour ne pas surcharger l'API

# Lancer l'update
if __name__ == "__main__":
    update_game_data()
