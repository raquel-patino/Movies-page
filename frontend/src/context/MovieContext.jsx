import { createContext, useState, useEffect, useContext } from "react";

/* Un context esta creado para envolver otros elementos con un estado. 
En la otra app utilizabamos authcontext */

const MovieContext= createContext()

export const useMovieContext = () => useContext (MovieContext)

// necesitamos que usestate empiece leyendo los favoritos del storage, sino siempre se renderiza vacio
export const MovieProvider= ({children}) => {
    const [favorites, setFavorites] = useState(() => {
        const stored = localStorage.getItem("favorites")
        try {
          return stored && stored !== "undefined" ? JSON.parse(stored) : []
        } catch {
          return []
        }
      })


/* useEffect(()=> { con este effecto miramos en storage si hay favoritos, 
    en localstorage siempre se guardan strings por eso tenemos que cambiarlo a JS
    para que se pueda actualizar el estado y luego poder hacer map
    Basicamente este useeffect solo se renderiza una vez cuando el array está vacío
   
    const storedFavs =localStorage.getItem ("favorites")
    if (storedFavs) setFavorites(JSON.parse(storedFavs))
        console.log("Después de setFavorites:", storedFavs)
}, [])
/*

/* Este efecto solo se renderiza si favorites cambia,
como localstorage solo admite strings, lo tenemos que convertir
*/

useEffect (() => {
 localStorage.setItem('favorites', JSON.stringify(favorites))
}, [favorites])

//le decimos coge el valor anterior y añadele una pelicula
// el operador ... crea un nuevo array añadiendo la pelicula es lo que react recomienda
//no se recomienda modificar el array anterior
const addToFavorites = (movie) =>{
    setFavorites( prev=> [...prev, movie])
}
/*
El método .filter() crea un nuevo array con todos los elementos 
que pasen una condición (retornen true).
*/
const removeFromFavorites = (movieId) =>{
    setFavorites(prev=> prev.filter(movie=> movie.id !== movieId))
}

const isFavorite = (movieId) =>{
    return favorites.some(movie =>movie.id === movieId)
}

const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
}

return <MovieContext.Provider value= {value}>
    {children}
</MovieContext.Provider>


}
