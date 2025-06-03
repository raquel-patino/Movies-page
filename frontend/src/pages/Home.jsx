import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import "../css/Home.css";
import { searchMovies } from "../services/api"; 
import { getPopularMovies } from "../services/api";


function Home(){
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
/*Como el array esta vacio, useeffect solo se ejecuta una vez al cargar la pagina
Si pusiesemos por ejemplo nombre y definirieramos un estado anterior para nombre, 
esta pagina se renderizaria cuando se cambiase el nombre, y no solo al cargar la pagina*/

    useEffect(() => {
        const loadPopularMovies= async () => {
            try {
                const popularMovies= await getPopularMovies()
                setMovies(popularMovies)
            } catch (err) {
                console.log(err)
                setError ("Failed to load movies")
            }
            finally {
                setLoading(false)
            }
        }
        loadPopularMovies() //tenemos que llamar a la funcion que hemos creado para que se carguen las peliculas
    }, []); 

const handleSearch= async (e) => {
    e.preventDefault() //con esto evitamos que la pagina se recargue y se mantiene la busqueda en el searchbar
    if (!searchQuery.trim()) return
    if (loading) return //si loadign es true (al principio siempre será true)

    setLoading(true)
    try {
        const searchResults= await searchMovies(searchQuery)
        setMovies(searchResults)
        setError(null)
    } catch (err) {
        console.log(err)
        setError ("Failed to search movies...")
    }
    finally {
        setLoading(false)
    }

    
};

//el comparador && se usa para evaluar si un valor es verdadero o existe en este caso con error
//y devolver algo en este caso, un mensaje por ejemplo.
return <div className="home">
    <form onSubmit={handleSearch} className="search-form">
        <input type= "text" placeholder="Search for movies..." className="search-input" value= {searchQuery}
        onChange={(e)=> setSearchQuery(e.target.value)}></input>
        <button type= "submit" className="search-button">Search </button>
    </form>


{ error && <div className="error-message"> {error}</div>}

{loading ? (<div className= "loading">Loading...</div>) :
   <div className="movies-grid">
   {movies.map((movie) =>
      (<MovieCard movie={movie} key={movie.id} />
   ))}
</div>

}
 
</div>


}
export default Home