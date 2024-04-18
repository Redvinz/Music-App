import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import tempMusicData from "./tempMusicData";
import tempPlaylist from "./tempPlaylist";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Padding } from "@mui/icons-material";

function App() {
  const [music, setMusic] = useState(tempMusicData);
  const [playlist, setPlaylist] = useState(tempPlaylist);

  const addToPlaylist = (song) => {
    setPlaylist([...playlist, song]);
  };
  const removeFromPlaylist = (id) => {
    setPlaylist(playlist.filter((song) => song.id !== id));
  };

  return (
    <>
      <NavBar>{/* <NumberResult music={music}/> */}</NavBar>
      <Main>
        <Box>
          <Music music={music} addToPlaylist={addToPlaylist} />
        </Box>
        <Box>
          <PlayList playlist={playlist} removeFromPlaylist={removeFromPlaylist} />
        </Box>
      </Main>
    </>
  );
}
function NavBar({ children }) {
  return (
    <nav className="container">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return <h1 className="pacifico-regular">MuziKo</h1>;
}

function NumberResult({ music }) {
  return (
    <p>
      Found <strong>{music.length}</strong> results
    </p>
  );
}

function Music({ music, addToPlaylist }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const handleAddToPlaylist = (song) => {
    addToPlaylist(song);
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterByGenre = (genre) => {
    setSelectedGenre(genre);
  };

  const sortedMusic = music.slice().sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "artist") {
      return a.artist.localeCompare(b.artist);
    }
    return 0;
  });

  const filteredMusic = selectedGenre
    ? sortedMusic.filter((song) => song.genre === selectedGenre)
    : sortedMusic;

  return (
    <div>
      <NumberResult music={filteredMusic} />
      <h2>Music List</h2>
      <input
        className="search"
        type="text"
        placeholder="Search"
        value={query}
        onChange={handleSearch}
      />
      A-Z:{" "}
      <select value={sortBy} onChange={handleSort}>
        <option value="">All </option>
        <option value="title">Title</option>
        <option value="artist">Artist</option>
      </select>
      Genre:{" "}
      <select
        value={selectedGenre}
        onChange={(e) => handleFilterByGenre(e.target.value)}
      >
        <option value="">All</option>
        <option value="Pop">Pop</option>
        <option value="Rock">Rock</option>
        <option value="Jazz">Jazz</option>
      </select>
      <ul>
        {filteredMusic
          .filter((song) => song.title.toLowerCase().includes(query.toLowerCase()))
          .map((song) => (
            <li className="reddit-mono" key={song.id}>
              {song.title}{" "}
              <p className="artist">
                {song.artist} ({song.genre})
                <button onClick={() => handleAddToPlaylist(song)} className="heart">
                  ♥️
                </button>
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}

function Search({ query, onSearch }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search"
      value={query}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}

function Box({ children }) {
  return <div className="container">{children}</div>;
}

function PlayList({ playlist, removeFromPlaylist }) {
  const handleRemoveFromPlaylist = (id) => {
    removeFromPlaylist(id);
  };

  const renderStars = (rating) => {
    console.log("Rating:", rating);
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push("⭐");
    }
    return stars.join("");
  };

  return (
    <div>
      <div>
        You have added <strong>{playlist.length}</strong> songs.
      </div>
      <h2>Playlist</h2>
      <ul>
        {playlist.map((music) => (
          <li className="reddit-mono" key={music.id}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                {music.title} by {music.artist}
              </div>
              <div>
                <span>{renderStars(music.rating)}</span>
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => handleRemoveFromPlaylist(music.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Main({ children }) {
  return <div className="container">{children}</div>;
}

export default App;
