import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { MovieCard } from "./MovieCard";
import { toPng } from "html-to-image";
import axios from "axios";
import { FacebookShareButton, FacebookIcon } from "react-share";

export const Watched = () => {
  const { watched } = useContext(GlobalContext);
  const [imgURI, setImgURI] = useState(null); // To hold the image URL

  // Handle image generation and sharing
  const handleGenerateImage = async () => {
    const node = document.getElementById("watchedListContainer");
    
    try {
      const dataUrl = await toPng(node, { cacheBust: true });
      const response = await axios.post("/image/base64ToPng", { image: dataUrl });
      setImgURI(response.data.imgURI); // Set the image URL
    } catch (error) {
      console.error("Error generating or uploading image:", error);
    }
  };

  return (
    <div className="movie-page">
      <div className="container">
        <div className="header">
          <h1 className="heading">Watched Movies</h1>

          <span className="count-pill">
            {watched.length} {watched.length === 1 ? "Movie" : "Movies"}
          </span>
        </div>

        <div id="watchedListContainer">
          {watched.length > 0 ? (
            <div className="movie-grid">
              {watched.map((movie) => (
                <MovieCard movie={movie} key={movie.id} type="watched" />
              ))}
            </div>
          ) : (
            <h2 className="no-movies">No movies in your list! Add some!</h2>
          )}
        </div>

        <button onClick={handleGenerateImage}>Generate & Share</button>

        {imgURI && (
          <FacebookShareButton url={imgURI}>
            <FacebookIcon size={32} />
          </FacebookShareButton>
        )}
      </div>
    </div>
  );
};

export default Watched;