
import { Routes, Route } from 'react-router-dom';
import "./css/App.css";
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import NavBar
 from './components/NavBar';
import { MovieProvider } from './context/MovieContext';
import Movie from './pages/Movie';
import Chat from './components/Chat';


function App() {
 

  return (
    <MovieProvider>
      <NavBar />
   <main className='main-content'>
    <Routes>
      <Route path= "/" element = {<Home/>}/>
      <Route path= "/favorites" element = {<Favorites/>}/>
      <Route path= "/movie/:movie_id" element = {<Movie/>}/>
      <Route path= "/chat" element = {<Chat/>}/>
    </Routes>
   </main>
   </MovieProvider>
 
  );
}



export default App
