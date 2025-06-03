import { showMovie } from "../services/api";
import { getComments } from "../services/api";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Moviepage.css";
import Chat from "../components/Chat.jsx";

function Movie() {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    const favoriteTitles = stored.map((movie) => movie.title);
    const { movie_id } = useParams();
    const [movie, setMovies] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [comment, setComments] = useState([]);
    const [expandedComments, setExpandedComments] = useState([]); 
    const cleanTitle = (title) => {
        return title.replace(/\*$/, '');
    };

    useEffect(() => {
        const showComments = async (movie_id) => {
            try {
                const comment = await getComments(movie_id);
                setComments(comment);
            } catch (err) {
                setError("Unable to find comments");
            } finally {
                setLoading(false);
            }
        };
        showComments(movie_id);
    }, []);

    useEffect(() => {
        const getMovie = async (movie_id) => {
            try {
                const movie = await showMovie(movie_id);
                setMovies(movie);
            } catch (err) {
                setError("Unable to find movie");
            } finally {
                setLoading(false);
            }
        };
        getMovie(movie_id);
    }, []);

    const toggleComment = (id) => {
        setExpandedComments((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="div_principal">
            {error && <div className="error-message"> {error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="div_1">
                    <h1 className="header_1">
                        {cleanTitle(movie.original_title)}
                    </h1>
                    <div className="div_3">
                        <div className="div_4">
                            <img className="poster" src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                        </div>
                        <div className="div_5">
                            <div className="div_6">
                                <h3 className="descr-header">DESCRIPTION:</h3>
                                <p className="descr-paragraph">{movie.overview}</p>
                            </div>
                            <div className="div_7">
                                <h3 className="release-head">RELEASE DATE:</h3>
                                <p className="release-para">{movie.release_date}</p>
                            </div>
                            <div className="div_8">
                                <h3 className="head-genres">GENRES</h3>
                                <p className="para-genres">{movie.genres.map((genre) => genre.name).join(', ')}</p>
                            </div>
                            <div className="div_9">
                                <h3 className="head-votes">VOTE AVERAGE</h3>
                                <p className="para-votes">{movie.vote_average}</p>
                            </div>
                        </div>
                    </div>

                    <div className="comments">
                        <h1 className="head-comments">Comments</h1>
                        <div>
                            {comment.results.map((result, id) => (
                                <div key={id}>
                                    <h3 className="author">{result.author}:</h3>
                                    <p
                                        className="content"
                                        onClick={() => toggleComment(id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {expandedComments.includes(id)
                                            ? result.content
                                            : result.content.length > 150
                                                ? result.content.slice(0, 150) + "..."
                                                : result.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Movie;
