import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


// ======================
// 🎤 GET ALL ARTISTS
// ======================

export const getArtists = query({
  args: {},

  handler: async (ctx) => {

    const artists = await ctx.db
      .query("artists")
      .collect();


    return artists;

  },
});



// ======================
// 🎤 GET SINGLE ARTIST
// ======================

export const getArtist = query({

  args:{
    id:v.id("artists"),
  },


  handler: async(ctx,args)=>{

    return await ctx.db.get(
      args.id
    );

  },

});




// ======================
// 🎤 CREATE ARTIST
// ======================

export const createArtist = mutation({

  args:{

    name:v.string(),

    image:v.optional(
      v.string()
    ),

  },


  handler:async(ctx,args)=>{


    const artistId =
      await ctx.db.insert(
        "artists",
        {

          name:args.name,

          image:args.image,


          followerCount:0,

          totalStreams:0,

          superfanCount:0,

          totalRevenue:0,

          monthlyListeners:0,

        }
      );


    return artistId;

  },

});




// ======================
// 🎤 DELETE ARTIST
// ======================

export const deleteArtist = mutation({

  args:{
    id:v.id("artists"),
  },


  handler:async(ctx,args)=>{


    await ctx.db.delete(
      args.id
    );


    return {
      success:true
    };

  },

});