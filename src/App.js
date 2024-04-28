import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import tempMusicData from "./tempMusicData";
import tempPlaylist from "./tempPlaylist";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Padding } from "@mui/icons-material";

const CLIENT_ID = "9f784fc5b36949f996024e488dbadba1";
const CLIENT_SECRET = "3f41b40871b841b09f8019e79c18d00d";

function App() {
  const [music, setMusic] = useState([]);
  const [playlist, setPlaylist] = useState([]);

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
          <Music music={music} setMusic={setMusic} addToPlaylist={addToPlaylist} />
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

function Music({ music, addToPlaylist, setMusic }) {
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
      {/* <input
        className="search"
        type="text"
        placeholder="Search"
        value={query}
        onChange={handleSearch}
      /> */}
      <Search initialQuery={query} onSearch={handleSearch} setMusic={setMusic} />
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
          .filter(
            (song) =>
              song &&
              song.name &&
              song.name.toLowerCase().includes(query.toLowerCase())
          ) // Filter based on track name
          .map((song) => (
            <li className="reddit-mono" key={song.id}>
              <div>
                <strong>{song.name}</strong> by {song.album.name} (
                {song.album.release_date.substring(0, 4)})
              </div>
              <p className="artist">
                {song.artists.map((artist) => artist.name).join(", ")}

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

function Search({ initialQuery, onSearch, setMusic }) {
  const [query, setQuery] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((res) => res.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  async function search() {
    console.log("Searching for " + query);

    var trackParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=50",
        trackParameters
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Data from Spotify API:", data);

      // Ensure that data.tracks.items exists and is an array before setting the music state
      if (
        data &&
        data.tracks &&
        data.tracks.items &&
        Array.isArray(data.tracks.items)
      ) {
        setMusic(data.tracks.items); // Set music state as an array of music objects
      } else {
        console.error("Invalid data format received from Spotify API");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };
  return (
    <input
      className="search"
      type="text"
      placeholder="Search"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          search();
        }
      }}
      value={query}
      onChange={handleSearch}
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

  // const renderStars = (rating) => {
  //   console.log("Rating:", rating);
  //   const stars = [];
  //   for (let i = 0; i < rating; i++) {
  //     stars.push("⭐");
  //   }
  //   return stars.join("");
  // };

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
              <div>{music.title}</div>

              <div>
                {/* <span>{renderStars(music.rating)}</span> */}
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => handleRemoveFromPlaylist(music.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
            <p className="artist"> {music.artist}</p>
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

// import React from 'react'

// export default function App() {
// // fetch("https://jsonplaceholder.typicode.com/todos").then((result)=>result.json().then((data) => console.log(data)));

// async function getTodos () {
//   const result = await fetch ("https://jsonplaceholder.typicode.com/todos");
//   const data = await result.json();
//   console.log(data);
// }
// getTodos();
// console.log("Hello");

//   return (
//     <div>App</div>
//   )
// }
