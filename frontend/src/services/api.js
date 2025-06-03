const API_KEY= "59662d6aad5cbe9db46002462358871b"
const BASE_URL= "https://api.themoviedb.org/3"


export const getPopularMovies = async () => { 
    /*estamos creando una funcion que utilizaremos mas adelante
    utilizamos primero el endpoint de peliculas populares y añadimos la api_key
    luego hacemos un fetch a la url y guardamos la respuesta en una variable
    luego convertimos la respuesta a json y guardamos el resultado en otra variable
    y finalmente retornamos el resultado*/
    const response = await fetch (`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
};


export const searchMovies = async (query) => { 

    const response = await fetch 
    (`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results; //results devuelve una lista
};

export const showMovie = async (movie_id) => {
    const response = await fetch
    (`${BASE_URL}/movie/${movie_id}?api_key=${API_KEY}`);
    const data =await response.json();
    return data; //data devuelve un objeto
};

export const getComments =async (movie_id) => {
    const response = await fetch
    (`${BASE_URL}/movie/${movie_id}/reviews?api_key=${API_KEY}`);
    const data = await response.json();
    return data;
}

export const getSuggestions = async (prompt, favorites) => {
  const response = await fetch("http://localhost:5000/suggest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      prompt,
      favorites, // nuevo campo
    }),
  });

  if (!response.ok) throw new Error("Error al obtener sugerencias");
  return await response.json();
};

export const getCurrentUser = async () => {
  const response = await fetch("http://localhost:5000/api/me", {
    credentials: "include",
    mode: "cors"
  });

  if (!response.ok) throw new Error("No autorizado");
  return await response.json();
};