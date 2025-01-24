export const fetchGames = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/games");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux :", error);
    return [];
  }
};
