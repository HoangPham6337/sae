import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyList(){
    const navigate = useNavigate();
    useEffect(() => {
        const fetchGames = async () => {
            const response = await fetch("http://localhost:5001/mygamelist?user_id=3316",
                {
                    method:"GET",
                    credentials:"include",
                    headers:{
                        'Authorization':`Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            )

            if (response.ok) {
                const data = await response.json();

                if (data.newAccesToken) {
                    localStorage.setItem('accessToken', data.newAccesToken);
                }

                return data.gameList;
            } else {
                navigate('/login');
            }

            return null;

            
        }
        
        const displayGames = async () => {
            const gameList = await fetchGames();
            
            if (gameList) {
                const ul = document.querySelector("ul");

                gameList.forEach(game => {
                    let li = document.createElement('li');
                    li.textContent = game;

                    ul.appendChild(li); 
                });
            } 
        }

        displayGames();
       
        
    },[])

    return (
        <div>
            <p>My Games</p>
            <ul> </ul>
        </div>
    )
}