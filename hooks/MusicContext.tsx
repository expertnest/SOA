"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import type { Id } from "@/convex/_generated/dataModel";

/* =========================
   LOCAL PLAYER TYPE
   ========================= */
export type Song = {
  songId: Id<"songs">;

  // compatibility id for UI
  id?: string;

  title: string;

  // old + new artist support
  artistName: string;
  artist?: string;

  // artwork support
  coverImage?: string;
  image?: string;

  duration: number;

  totalPlays: number;
  skipRate: number;
  replayRate: number;

  // frontend audio
  src: string;

  // Convex compatibility
  audioUrl?: string;

  genre?: string;
  category?: string;
};


type MusicContextType = {
  isPlaying: boolean;
  togglePlay: () => void;
  handleNext: () => void;
  handlePrev: () => void;

  currentSong: Song | null;

  progress: number;
  seek: (value: number) => void;

  volume: number;
  setVolume: (v: number) => void;

  playSong: (song: Song) => void;

  setCurrentSongIndex: React.Dispatch<
    React.SetStateAction<number>
  >;

  duration: number;
};


const MusicContext =
  createContext<MusicContextType | undefined>(
    undefined
  );


export function MusicProvider({
  children,
}: {
  children: React.ReactNode;
}) {


  // ======================
  // 🎧 RAW CONVEX SONGS
  // ======================

  const rawSongs =
    useQuery(api.songs.getSongsForFeed) ?? [];



  // ======================
  // 🔥 MAP CONVEX → PLAYER SONGS
  // ======================

  const songs: Song[] =
    rawSongs.map((s: any) => ({

      songId: s.songId,


      // compatibility
      id: s.songId,


      title: s.title,


      artistName:
        s.artistName ||
        "Unknown Artist",


      artist:
        s.artistName ||
        "Unknown Artist",



      coverImage:
        s.coverImage ||
        "/assets/soalogo.png",


      image:
        s.coverImage &&
        s.coverImage.startsWith("http")
          ? s.coverImage
          : "/assets/soalogo.png",



      duration:
        s.duration || 0,


      totalPlays:
        s.totalPlays || 0,


      skipRate:
        s.skipRate || 0,


      replayRate:
        s.replayRate || 0,



      // compatibility
      audioUrl:
        s.audioUrl,


      src:
        s.audioUrl ||
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",



      genre:
        s.genre ||
        "Music",


      category:
        s.genre ||
        "Music",

    }));



  const defaultIndex = 0;


  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);


  const [
    currentSongIndex,
    setCurrentSongIndex,
  ] = useState(defaultIndex);


  const [
    progress,
    setProgress,
  ] = useState(0);


  const [
    volume,
    setVolume,
  ] = useState(1);


  const [
    duration,
    setDuration,
  ] = useState(0);



  const audioRef =
    useRef<HTMLAudioElement | null>(
      null
    );



  const currentSong =
    songs[currentSongIndex] || null;



  // ======================
  // 🎧 INIT AUDIO
  // ======================

  useEffect(() => {

    if (!currentSong)
      return;



    if (!audioRef.current) {

      audioRef.current =
        new Audio(
          currentSong.src
        );

    }



    const audio =
      audioRef.current;



    const updateProgress = () => {

      if (audio.duration) {

        setProgress(
          (audio.currentTime /
            audio.duration) *
            100
        );


        setDuration(
          audio.duration
        );

      }

    };



    const handleEnded = () => {

      if (
        currentSongIndex <
        songs.length - 1
      ) {

        handleNext();

      } else {

        setIsPlaying(false);

      }

    };



    audio.addEventListener(
      "timeupdate",
      updateProgress
    );


    audio.addEventListener(
      "ended",
      handleEnded
    );



    return () => {

      audio.removeEventListener(
        "timeupdate",
        updateProgress
      );


      audio.removeEventListener(
        "ended",
        handleEnded
      );

    };


  }, [
    currentSongIndex,
    currentSong?.src,
    songs,
  ]);




  // ======================
  // ▶️ PLAY / PAUSE
  // ======================

  const togglePlay = () => {

    const audio =
      audioRef.current;


    if (
      !audio ||
      !currentSong
    )
      return;



    if (isPlaying)
      audio.pause();

    else
      audio.play();



    setIsPlaying(
      !isPlaying
    );

  };




  // ======================
  // ⏭ NEXT
  // ======================

  const handleNext = () => {

    if (
      currentSongIndex >=
      songs.length - 1
    )
      return;



    const nextIndex =
      currentSongIndex + 1;



    setCurrentSongIndex(
      nextIndex
    );



    if (
      audioRef.current &&
      songs[nextIndex]
    ) {

      audioRef.current.src =
        songs[nextIndex].src;



      if (isPlaying)
        audioRef.current.play();

    }

  };




  // ======================
  // ⏮ PREV
  // ======================

  const handlePrev = () => {

    if (
      currentSongIndex <= 0
    )
      return;



    const prevIndex =
      currentSongIndex - 1;



    setCurrentSongIndex(
      prevIndex
    );



    if (
      audioRef.current &&
      songs[prevIndex]
    ) {

      audioRef.current.src =
        songs[prevIndex].src;



      if (isPlaying)
        audioRef.current.play();

    }

  };




  // ======================
  // 🎯 SEEK
  // ======================

  const seek = (
    value:number
  ) => {

    if (
      audioRef.current &&
      audioRef.current.duration
    ) {

      audioRef.current.currentTime =
        (value / 100) *
        audioRef.current.duration;


      setProgress(value);

    }

  };




  // ======================
  // 🎵 PLAY SPECIFIC SONG
  // ======================

  const playSong = (
    song:Song
  ) => {


    const index =
      songs.findIndex(
        (s) =>
          s.songId ===
          song.songId
      );



    if (
      index !== -1 &&
      audioRef.current
    ) {


      setCurrentSongIndex(
        index
      );


      audioRef.current.src =
        song.src;


      audioRef.current.play();


      setIsPlaying(
        true
      );

    }

  };




  // ======================
  // 🔊 VOLUME
  // ======================

  useEffect(() => {

    if(audioRef.current){

      audioRef.current.volume =
        volume;

    }

  },[volume]);




  return (
    <MusicContext.Provider

      value={{

        isPlaying,

        togglePlay,

        handleNext,

        handlePrev,


        currentSong,


        progress,

        seek,


        volume,

        setVolume,


        playSong,


        setCurrentSongIndex,


        duration,

      }}

    >

      {children}

    </MusicContext.Provider>
  );

}



export function useMusic(){

  const ctx =
    useContext(
      MusicContext
    );


  if(!ctx)
    throw new Error(
      "useMusic must be used within MusicProvider"
    );


  return ctx;

}