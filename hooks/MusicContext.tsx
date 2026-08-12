"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import type { Id } from "@/convex/_generated/dataModel";


/* =========================
   LOCAL PLAYER TYPE
   ========================= */

export type Song = {
  songId: Id<"songs">;

  id?: string;

  title: string;

  artistName: string;
  artist?: string;

  coverImage?: string;
  image?: string;

  duration: number;

  totalPlays: number;
  skipRate: number;
  replayRate: number;

  src: string;

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

  seek: (value:number)=>void;


  volume:number;

  setVolume:(v:number)=>void;


  playSong:(song:Song)=>void;


  setCurrentSongIndex:
    React.Dispatch<
      React.SetStateAction<number>
    >;


  duration:number;
};



const MusicContext =
  createContext<
    MusicContextType | undefined
  >(undefined);



export function MusicProvider({
  children,
}:{
  children:React.ReactNode;
}) {



  // ======================
  // 🎧 RAW CONVEX SONGS
  // ======================

  const rawSongs =
    useQuery(
      api.songs.getSongsForFeed
    ) ?? [];




  // ======================
  // 📊 ANALYTICS MUTATION
  // ======================

  const trackEvent =
    useMutation(
      api.events.trackEvent
    );



  // ======================
  // 👤 ANONYMOUS ID
  // ======================

  const anonymousId =
    useRef<string | null>(null);



  useEffect(()=>{


    if(
      typeof window === "undefined"
    )
      return;



    let id =
      localStorage.getItem(
        "soa_anonymous_id"
      );



    if(!id){

      id =
        crypto.randomUUID();


      localStorage.setItem(
        "soa_anonymous_id",
        id
      );

    }


    anonymousId.current = id;


  },[]);





  // ======================
  // 🔥 MAP CONVEX → PLAYER
  // ======================

  const songs:Song[] =
    rawSongs.map(
      (s:any)=>({

        songId:s.songId,


        id:s.songId,


        title:s.title,


        artistName:
          s.artistName ??
          "Unknown Artist",


        artist:
          s.artistName ??
          "Unknown Artist",



        coverImage:
          s.coverImage ??
          "/assets/soalogo.png",


        image:
          s.coverImage &&
          s.coverImage.startsWith("http")
            ? s.coverImage
            : "/assets/soalogo.png",



        duration:
          s.duration ?? 0,



        totalPlays:
          s.totalPlays ?? 0,


        skipRate:
          s.skipRate ?? 0,


        replayRate:
          s.replayRate ?? 0,



        audioUrl:
          s.audioUrl,



        src:
          s.audioUrl ??
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",



        genre:
          s.genre ??
          "Music",



        category:
          s.genre ??
          "Music",

      })
    );




  const [
    isPlaying,
    setIsPlaying
  ] =
  useState(false);



  const [
    currentSongIndex,
    setCurrentSongIndex
  ] =
  useState(0);



  const [
    progress,
    setProgress
  ] =
  useState(0);



  const [
    volume,
    setVolume
  ] =
  useState(1);



  const [
    duration,
    setDuration
  ] =
  useState(0);



  const audioRef =
    useRef<HTMLAudioElement | null>(
      null
    );



  const currentSong =
    songs[currentSongIndex] ?? null;




  // ======================
  // 📈 RETENTION TRACKING
  // ======================


  const trackedMilestones =
    useRef<
      Set<number>
    >(new Set());



    const sendEvent = (
      type:
        | "song_play"
        | "song_end"
        | "song_skip",
      song: Song
    )=>{
      if(!anonymousId.current) return;
    
      trackEvent({
        userId: anonymousId.current,
        isAnonymous:true,
        type,
        songId:song.songId,
        playedDuration:
          audioRef.current?.currentTime ?? 0,
        duration:
          audioRef.current?.duration ?? song.duration,
        source:"music_player",
        deviceType:"web",
      });
    };


  // ======================
  // 🎧 INIT AUDIO ENGINE
  // ======================


  useEffect(()=>{


    if(!currentSong)
      return;



    trackedMilestones.current.clear();



    if(!audioRef.current){

      audioRef.current =
        new Audio(
          currentSong.src
        );

    }



    const audio =
      audioRef.current;



    audio.src =
      currentSong.src;



    audio.volume =
      volume;



    const updateProgress = ()=>{


      if(!audio.duration)
        return;



      const percent =
        (
          audio.currentTime /
          audio.duration
        ) * 100;



      setProgress(percent);



      setDuration(
        audio.duration
      );



      // ======================
      // 📈 RETENTION EVENTS
      // ======================


      const milestones = [
        10,
        25,
        50,
        75,
        90,
      ];



      milestones.forEach(
        async(point)=>{


          if(
            percent >= point &&
            !trackedMilestones.current.has(point)
          ){


            trackedMilestones.current.add(
              point
            );



            if(
              anonymousId.current
            ){


              await trackEvent({

                userId:
                  anonymousId.current,


                isAnonymous:true,


                type:
                  "song_play",


                songId:
                  currentSong.songId,


                duration:
                  audio.currentTime,


                source:
                  `retention_${point}%`,


                deviceType:
                  "web",

              });


            }


          }


        }
      );


    };





    const handleEnded =
      async()=>{


        await sendEvent(
          "song_end",
          currentSong
        );



        if(
          currentSongIndex <
          songs.length - 1
        ){

          handleNext();

        }
        else{

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



    return()=>{


      audio.removeEventListener(
        "timeupdate",
        updateProgress
      );



      audio.removeEventListener(
        "ended",
        handleEnded
      );


    };



  },[
    currentSong?.src,
    currentSongIndex,
  ]);





  // ======================
  // ▶️ PLAY / PAUSE
  // ======================


  const togglePlay = ()=>{


    const audio =
      audioRef.current;



    if(
      !audio ||
      !currentSong
    )
      return;



    if(isPlaying){

      audio.pause();


    }
    else{


      audio.play();



      sendEvent(
        "song_play",
        currentSong
      );


    }



    setIsPlaying(
      !isPlaying
    );


  };





  // ======================
  // ⏭ NEXT
  // ======================


  const handleNext = async()=>{


    if(
      currentSong
    ){

      await sendEvent(
        "song_skip",
        currentSong
      );

    }



    if(
      currentSongIndex >=
      songs.length - 1
    )
      return;




    const nextIndex =
      currentSongIndex + 1;



    setCurrentSongIndex(
      nextIndex
    );



    setProgress(0);



    if(
      audioRef.current &&
      songs[nextIndex]
    ){


      audioRef.current.src =
        songs[nextIndex].src;



      if(isPlaying)
        audioRef.current.play();


    }



  };






  // ======================
  // ⏮ PREVIOUS
  // ======================


  const handlePrev = ()=>{


    if(
      currentSongIndex <= 0
    )
      return;



    const prevIndex =
      currentSongIndex - 1;



    setCurrentSongIndex(
      prevIndex
    );



    setProgress(0);



    if(
      audioRef.current &&
      songs[prevIndex]
    ){


      audioRef.current.src =
        songs[prevIndex].src;



      if(isPlaying)
        audioRef.current.play();


    }


  };






  // ======================
  // 🎯 SEEK
  // ======================


  const seek = (
    value:number
  )=>{


    if(
      audioRef.current &&
      audioRef.current.duration
    ){


      audioRef.current.currentTime =
        (
          value / 100
        ) *
        audioRef.current.duration;



      setProgress(
        value
      );


    }


  };






  // ======================
  // 🎵 PLAY SPECIFIC SONG
  // ======================


  const playSong = (
    song:Song
  )=>{


    const index =
      songs.findIndex(
        (s)=>
          s.songId ===
          song.songId
      );



    if(
      index === -1 ||
      !audioRef.current
    )
      return;




    setCurrentSongIndex(
      index
    );



    trackedMilestones.current.clear();



    audioRef.current.src =
      song.src;



    audioRef.current.play();



    setIsPlaying(
      true
    );



    sendEvent(
      "song_play",
      song
    );


  };






  // ======================
  // 🔊 VOLUME SYNC
  // ======================


  useEffect(()=>{


    if(
      audioRef.current
    ){

      audioRef.current.volume =
        volume;

    }


  },[
    volume
  ]);






  // ======================
  // PROVIDER
  // ======================


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