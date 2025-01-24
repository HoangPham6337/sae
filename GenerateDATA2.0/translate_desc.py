import json
from translatepy import Translator
import os

def translate_description(description):
    """
    Traduit une description de l'anglais vers le français.
    """
    translator = Translator()
    try:
        # Traduction de l'anglais vers le français
        translation = translator.translate(description, "fr")
        return translation.result  # Retourne la traduction en français
    except Exception as e:
        print(f"Erreur lors de la traduction : {e}")
        return "Non traduit"

def load_progress(progress_file):
    """
    Charge la progression actuelle (ligne du fichier source).
    """
    if os.path.exists(progress_file):
        with open(progress_file, "r", encoding="utf-8") as f:
            return int(f.read().strip())
    return 0

def save_progress(progress_file, line_number):
    """
    Sauvegarde la ligne actuelle du fichier source.
    """
    with open(progress_file, "w", encoding="utf-8") as f:
        f.write(str(line_number))

def process_descriptions(input_file, output_file, progress_file):
    """
    Transforme les descriptions des jeux en un format multilingue et les traduit.
    """
    with open(input_file, "r", encoding="utf-8") as infile:
        games = json.load(infile)

    # Charger la progression existante
    start_index = load_progress(progress_file)

    # Charger les jeux déjà traités, si le fichier de sortie existe
    if os.path.exists(output_file):
        with open(output_file, "r", encoding="utf-8") as outfile:
            processed_games = json.load(outfile)
    else:
        processed_games = []

    for i, game in enumerate(games[start_index:], start=start_index):
        if "description" in game:
            description_en = game["description"]
            description_fr = translate_description(description_en)
            game["description"] = {
                "en": description_en,
                "fr": description_fr
            }

        # Ajouter le jeu traité à la liste
        processed_games.append(game)

        # Sauvegarder la progression toutes les 50 jeux
        if (i + 1) % 50 == 0:
            print(f"Progression : {i + 1} jeux traités...")
            save_progress(progress_file, i + 1)
            with open(output_file, "w", encoding="utf-8") as outfile:
                json.dump(processed_games, outfile, ensure_ascii=False, indent=4)

    # Sauvegarder les jeux transformés dans le fichier final
    with open(output_file, "w", encoding="utf-8") as outfile:
        json.dump(processed_games, outfile, ensure_ascii=False, indent=4)

    # Sauvegarder la progression finale
    save_progress(progress_file, len(games))
    print("Traitement terminé.")

if __name__ == "__main__":
    input_file = "processed_games.json"  # Remplacez par votre fichier source
    output_file = "output_games.json"  # Fichier de sortie avec les descriptions traduites
    progress_file = "progress1.json"  # Fichier de suivi de progression
    process_descriptions(input_file, output_file, progress_file)
