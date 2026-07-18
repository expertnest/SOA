"use client";

import { useState } from "react";
import {
  UploadCloud,
  Music2,
  Image as ImageIcon,
  Album,
  Disc3,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  User,
} from "lucide-react";

import { motion } from "framer-motion";

// ✅ UPDATED IMPORT
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type ReleaseType = "single" | "ep" | "album" | "mixtape";

interface Artist {
  _id: Id<"artists">;
  name: string;
}

interface Track {
  id: string;
  title: string;
  genre: string;
  file: File | null;
  duration: number;
}

const releaseTypes = [
  {
    id: "single",
    label: "Single",
    icon: Disc3,
    description: "One track release",
  },
  {
    id: "ep",
    label: "EP",
    icon: Music2,
    description: "Short project",
  },
  {
    id: "album",
    label: "Album",
    icon: Album,
    description: "Full length project",
  },
  {
    id: "mixtape",
    label: "Mixtape",
    icon: Music2,
    description: "Collection of tracks",
  },
] as const;

export default function ReleasesPage() {

  // ✅ MUTATIONS + ACTION
  const createProject = useMutation(api.projects.createProject);
  const createSong = useMutation(api.songs.createSong);
  const uploadAudio = useAction(api.storage.uploadAudio);
  const uploadImage = useAction(api.storage.uploadImage);
  const artists = useQuery(api.artists.getArtists);


  const [releaseType, setReleaseType] =
    useState<ReleaseType>("single");


  const [artistId, setArtistId] =
    useState<Id<"artists"> | null>(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [releaseDate, setReleaseDate] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [tracks, setTracks] = useState<Track[]>([]);

  const [loading, setLoading] = useState(false);



  const artistColors = [
    "from-purple-500 to-pink-500",
    "from-cyan-500 to-blue-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-emerald-500",
  ];


  const getArtistColor = (index: number) => {
    return artistColors[index % artistColors.length];
  };


  const inputClass = `
    w-full rounded-2xl border border-white/10 bg-white/[0.04]
    px-5 py-4 text-white placeholder:text-white/30 outline-none
    transition-all focus:border-purple-500/50 focus:bg-white/[0.07]
  `;



  const addTrack = () => {

    setTracks(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        genre: "",
        file: null,
        duration: 0,
      },
    ]);

  };



  const updateTrack = (
    id: string,
    field: keyof Track,
    value: any
  ) => {

    setTracks(prev =>
      prev.map(track =>
        track.id === id
          ? { ...track, [field]: value }
          : track
      )
    );

  };



  const removeTrack = (id: string) => {

    setTracks(prev =>
      prev.filter(track => track.id !== id)
    );

  };



  // ✅ UPDATED
  const handleCover=(file:File)=>{

    setCoverFile(file);
   
    setCoverPreview(
      URL.createObjectURL(file)
    );
   
   };

  const handleAudio = (id: string, file: File) => {

    const audio =
      new Audio(URL.createObjectURL(file));


    audio.onloadedmetadata = () => {

      updateTrack(
        id,
        "duration",
        Math.floor(audio.duration)
      );

    };


    updateTrack(
      id,
      "file",
      file
    );

  };




  // =========================
  // 🚀 UPDATED BACKEND LOGIC
  // =========================

  const handleCreate = async () => {

    if (!title || !artistId)
      return;



    if (tracks.length === 0) {

      alert("Add at least 1 track");

      return;

    }



    setLoading(true);



    try {


      // =========================
      // 🖼️ UPLOAD COVER TO R2
      // =========================

      let uploadedCoverUrl = "";



      if (coverFile) {

        const coverBuffer =
          await coverFile.arrayBuffer();



        const uploadedCover =
          await uploadAudio({

            file: coverBuffer,

            fileName:
              coverFile.name,

            contentType:
              coverFile.type,

          });



        uploadedCoverUrl =
          uploadedCover.url;

      }



      // 🔥 CREATE PROJECT

      const projectId =
        await createProject({

          name: title,

          artistId,

          description,

          // ✅ NOW REAL R2 URL
          coverImage:
            uploadedCoverUrl,

          releaseDate:
            releaseDate
              ? new Date(releaseDate).getTime()
              : undefined,

        });





      // 🔥 CREATE SONGS WITH REAL UPLOAD

      for (
        let i = 0;
        i < tracks.length;
        i++
      ) {


        const track =
          tracks[i];


        if (!track.title || !track.file)
          continue;



        // ✅ CONVERT FILE → BUFFER

        const buffer =
          await track.file.arrayBuffer();




        // ✅ UPLOAD AUDIO TO R2

        const uploaded =
          await uploadAudio({

            file: buffer,

            fileName:
              track.file.name,

            contentType:
              track.file.type,

          });




        // ✅ SAVE SONG

        await createSong({

          title:
            track.title,

          artistId,

          duration:
            track.duration,

          genre:
            track.genre,


          // ✅ REAL IMAGE URL
          coverImage:
            uploadedCoverUrl,


          // ✅ REAL AUDIO URL
          audioUrl:
            uploaded.url,


          projectId,

          trackNumber:
            i + 1,

        });


      }




      console.log(
        "✅ Release created"
      );



      // reset

      setTitle("");

      setDescription("");

      setTracks([]);

      setCoverPreview("");

      setCoverFile(null);



    } catch(error) {

      console.error(error);


    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* UI UNCHANGED BELOW */}
      {/* (ALL YOUR UI BELOW UNCHANGED) */}

    {/* Background Glow */}
    <div className="
      pointer-events-none
      absolute
      left-1/4
      top-0
      h-[500px]
      w-[500px]
      rounded-full
      bg-purple-600/20
      blur-[160px]
    " />

    <div className="
      pointer-events-none
      absolute
      bottom-0
      right-1/4
      h-[450px]
      w-[450px]
      rounded-full
      bg-cyan-500/10
      blur-[160px]
    " />


    <div className="
      relative
      mx-auto
      max-w-7xl
      px-6
      py-12
    ">


      {/* Header */}

      <div className="mb-10">

        <div className="
          flex
          items-center
          gap-2
          text-purple-400
          text-sm
          mb-3
        ">
          <Sparkles size={16}/>
          Music Management
        </div>


        <h1 className="
          text-5xl
          font-bold
          tracking-tight
        ">
          Create Release
        </h1>


        <p className="
          mt-3
          text-white/50
          max-w-xl
        ">
          Build singles, EPs, albums and manage
          your label catalog.
        </p>

      </div>




      <motion.div

        initial={{
          opacity:0,
          y:20
        }}

        animate={{
          opacity:1,
          y:0
        }}

        className="
          grid
          gap-8
          lg:grid-cols-[380px_1fr]
        "

      >



        {/* LEFT COLUMN */}

        <div className="space-y-6">


          {/* Artwork */}

          <div className="
            rounded-[32px]
            border
            border-white/10
            bg-white/[0.04]
            p-5
            backdrop-blur-xl
          ">


            <h2 className="
              mb-4
              text-sm
              text-white/50
            ">
              Cover Artwork
            </h2>


            <label className="
              relative
              flex
              aspect-square
              cursor-pointer
              items-center
              justify-center
              overflow-hidden
              rounded-[28px]
              border
              border-dashed
              border-white/20
              bg-gradient-to-br
              from-purple-500/10
              to-cyan-500/10
              transition
              hover:border-purple-400/50
            ">


              {
                coverPreview ?

                (
                  <img
                    src={coverPreview}
                    alt="cover"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                )

                :

                (

                  <div className="
                    text-center
                  ">

                    <ImageIcon
                      size={45}
                      className="
                        mx-auto
                        mb-4
                        text-white/40
                      "
                    />


                    <p className="
                      font-medium
                    ">
                      Upload Artwork
                    </p>


                    <p className="
                      mt-1
                      text-xs
                      text-white/40
                    ">
                      PNG, JPG, WEBP
                    </p>


                  </div>

                )

              }



              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e)=>
                  e.target.files?.[0] &&
                  handleCover(
                    e.target.files[0]
                  )
                }
              />

            </label>

          </div>


   {/* Release Type */}


          <div className="
            rounded-[32px]
            border
            border-white/10
            bg-white/[0.04]
            p-5
          ">


            <h2 className="
              mb-4
              text-sm
              text-white/50
            ">
              Release Type
            </h2>


            <div className="
              space-y-3
            ">


            {
              releaseTypes.map(item=>{


                const Icon=item.icon;


                return (

                  <button

                    key={item.id}

                    onClick={()=>
                      setReleaseType(
                        item.id
                      )
                    }

                    className={`
                      flex
                      w-full
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      p-4
                      transition-all

                      ${
                        releaseType === item.id

                        ?

                        `
                        border-purple-500/50
                        bg-purple-500/20
                        `

                        :

                        `
                        border-white/10
                        bg-white/[0.03]
                        hover:bg-white/[0.07]
                        `
                      }

                    `}

                  >


                    <Icon size={22}/>


                    <div className="
                      text-left
                    ">

                      <p className="
                        font-medium
                      ">
                        {item.label}
                      </p>

                      <p className="
                        text-xs
                        text-white/40
                      ">
                        {item.description}
                      </p>


                    </div>


                  </button>

                )


              })

            }


            </div>


          </div>



        </div>








        {/* RIGHT COLUMN */}

        <div className="
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.04]
          p-8
          backdrop-blur-xl
          space-y-8
        ">



          {/* Info */}


          <section className="space-y-4">


            <input

              className={inputClass}

              placeholder="Release title"

              value={title}

              onChange={(e)=>
                setTitle(
                  e.target.value
                )
              }

            />





            {/* Artist Cards */}


            <div>


              <p className="
                mb-3
                text-sm
                text-white/50
              ">
                Select Artist
              </p>



              <div className="
                grid
                grid-cols-2
                gap-3
              ">


              {
                artists?.map((artist,index)=>(


                  <button

                    key={artist._id}

                    onClick={()=>
                      setArtistId(
                        artist._id
                      )
                    }

                    className={`

                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition

                      ${
                        artistId === artist._id

                        ?

                        `
                        border-white
                        bg-white
                        text-black
                        `

                        :

                        `
                        border-white/10
                        bg-white/[0.03]
                        hover:bg-white/[0.08]
                        `
                      }

                    `}

                  >

                        <div
                          className={`
                            mb-3
                            h-10
                            w-10
                            rounded-full
                            bg-gradient-to-br
                            ${getArtistColor(index)}
                          `}
                        />

                    <p className="
                      font-medium
                    ">
                      {artist.name}
                    </p>


                  </button>


                ))

              }


              </div>

            </div>





            <textarea

              className={`
                ${inputClass}
                h-32
                resize-none
              `}

              placeholder="Release description"

              value={description}

              onChange={(e)=>
                setDescription(
                  e.target.value
                )
              }

            />




            <div className="
              relative
            ">

              <Calendar
                className="
                  absolute
                  left-4
                  top-4
                  text-white/40
                "
                size={18}
              />

              <input

                type="date"

                className={`
                  ${inputClass}
                  pl-12
                `}

                value={releaseDate}

                onChange={(e)=>
                  setReleaseDate(
                    e.target.value
                  )
                }

              />

            </div>


          </section>







          {/* Tracks */}


          <section>


            <div className="
              mb-5
              flex
              items-center
              justify-between
            ">


              <h2 className="
                font-medium
              ">
                Tracks
              </h2>



              <button

                onClick={addTrack}

                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-black
                "

              >

                <Plus size={16}/>

                Add Track

              </button>


            </div>





            <div className="space-y-4">


            {
              tracks.map((track,index)=>(


                <div

                  key={track.id}

                  className="
                    rounded-3xl
                    border
                    border-white/10
                    bg-black/20
                    p-5
                  "

                >


                  <div className="
                    mb-4
                    flex
                    justify-between
                  ">


                    <p>
                      {index+1}. Track
                    </p>



                    <button

                      onClick={()=>
                        removeTrack(
                          track.id
                        )
                      }

                      className="
                        text-red-400
                      "

                    >

                      <Trash2 size={17}/>

                    </button>


                  </div>





                  <input

                    className={inputClass}

                    placeholder="Song title"

                    value={track.title}

                    onChange={(e)=>
                      updateTrack(
                        track.id,
                        "title",
                        e.target.value
                      )
                    }

                  />




                  <label className="
                    mt-3
                    block
                    cursor-pointer
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    p-4
                    text-sm
                  ">


                    {
                      track.file
                      ?
                      track.file.name
                      :
                      "Upload Audio"
                    }


                    <input

                      hidden

                      type="file"

                      accept="audio/*"

                      onChange={(e)=>
                        e.target.files?.[0] &&
                        handleAudio(
                          track.id,
                          e.target.files[0]
                        )
                      }

                    />


                  </label>



                </div>


              ))

            }


            </div>


          </section>






          {/* Submit */}


          <button

            onClick={handleCreate}

            disabled={loading}

            className="
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-gradient-to-r
              from-purple-600
              to-cyan-500
              py-4
              font-semibold
              transition
              hover:scale-[1.01]
              disabled:opacity-50
            "

          >


            {
              loading

              ?

              <>
                <Loader2 className="animate-spin"/>
                Creating...
              </>

              :

              <>
                <UploadCloud size={18}/>
                Create Release
              </>
            }


          </button>



        </div>



      </motion.div>


    </div>


  </div>
);
}