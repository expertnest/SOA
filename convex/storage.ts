"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { NodeHttpHandler } from "@smithy/node-http-handler";


// ==============================
// 🔥 R2 CLIENT
// ==============================

const R2 = new S3Client({

  region: "auto",

  endpoint:
    `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,

  credentials: {

    accessKeyId:
      process.env.R2_ACCESS_KEY_ID!,

    secretAccessKey:
      process.env.R2_SECRET_ACCESS_KEY!,

  },

  requestHandler: new NodeHttpHandler(),

});


// ==============================
// 🚀 UPLOAD AUDIO TO R2
// ==============================

export const uploadAudio = action({

  args: {

    file: v.bytes(),

    fileName: v.string(),

    contentType: v.string(),

  },


  handler: async (ctx, args) => {


    const key =
      `audio/${Date.now()}-${args.fileName}`;



    // Convert Convex bytes -> Uint8Array

    const body =
      new Uint8Array(args.file);



    await R2.send(

      new PutObjectCommand({

        Bucket:
          process.env.R2_BUCKET_NAME!,


        Key:
          key,


        Body:
          body,


        ContentType:
          args.contentType,


      })

    );



    const publicUrl =
      `${process.env.R2_PUBLIC_URL}/${key}`;



    console.log(
      "✅ Uploaded to R2:",
      publicUrl
    );


    return {

      url: publicUrl,

      key,

    };


  },

});

export const uploadImage = action({

    args:{
      file:v.bytes(),
      fileName:v.string(),
      contentType:v.string(),
    },
  
  
    handler: async(ctx,args)=>{
  
      const key =
        `images/${Date.now()}-${args.fileName}`;
  
  
      await R2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key:key,
          Body:new Uint8Array(args.file),
          ContentType:args.contentType,
        })
      );
  
  
      return {
        url:
        `${process.env.R2_PUBLIC_URL}/${key}`,
        key,
      };
  
    }
  
  });