"use client";

import {
  MapPin,
  ArrowRight,
  Search,
} from "lucide-react";


const popularLocations = [
  "Atlanta, GA",
  "Dallas, TX",
  "Houston, TX",
  "Phoenix, AZ",
  "Denver, CO",
  "Miami, FL",
];


const totalLocations = [
  "Albuquerque, NM",
  "Austin, TX",
  "Boston, MA",
  "Charlotte, NC",
  "Chicago, IL",
  "Denver, CO",
  "Houston, TX",
  "Las Vegas, NV",
  "Miami, FL",
  "New York, NY",
  "Phoenix, AZ",
  "Seattle, WA",
];


export default function ServiceAreas() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="mx-auto max-w-6xl px-6">


        {/* Header */}

        <div className="text-center max-w-3xl mx-auto">

          <div
            className="
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-blue-100
            px-4
            py-2
            text-sm
            font-semibold
            text-blue-700
            "
          >
            <MapPin size={16}/>
            Nationwide Coverage
          </div>


          <h2
            className="
            mt-6
            text-4xl
            font-bold
            tracking-tight
            text-slate-900
            "
          >
            Dumpster Rentals Near You
          </h2>


          <p
            className="
            mt-4
            text-slate-600
            "
          >
            Reliable roll-off dumpster rentals available
            across cities nationwide.
          </p>


        </div>




        {/* Search */}

        <div
          className="
          mt-10
          mx-auto
          max-w-xl
          flex
          items-center
          gap-3
          rounded-xl
          bg-white
          border
          border-slate-200
          px-5
          py-4
          shadow-sm
          "
        >

          <Search 
            size={20}
            className="text-slate-400"
          />

          <input
            placeholder="Search your city..."
            className="
            w-full
            outline-none
            bg-transparent
            "
          />

        </div>




        {/* Popular Cities */}

        <div className="mt-14">


          <h3
            className="
            text-sm
            uppercase
            tracking-widest
            font-bold
            text-slate-500
            mb-6
            "
          >
            Popular Locations
          </h3>



          <div
            className="
            grid
            md:grid-cols-3
            gap-4
            "
          >

            {popularLocations.map(city=>(

              <div
                key={city}
                className="
                flex
                items-center
                justify-between
                rounded-xl
                bg-white
                border
                border-slate-200
                px-5
                py-5
                hover:shadow-md
                transition
                "
              >

                <div
                  className="
                  flex
                  items-center
                  gap-3
                  "
                >

                  <MapPin
                    size={18}
                    className="text-blue-600"
                  />

                  <span
                    className="
                    font-medium
                    text-slate-900
                    "
                  >
                    {city}
                  </span>

                </div>


                <ArrowRight
                  size={16}
                  className="text-slate-400"
                />

              </div>

            ))}


          </div>


        </div>





        {/* All Locations Preview */}

        <div
          className="
          mt-12
          rounded-2xl
          bg-white
          border
          border-slate-200
          p-8
          "
        >

          <div
            className="
            flex
            justify-between
            items-center
            mb-6
            "
          >

            <div>

              <h3
                className="
                text-xl
                font-bold
                text-slate-900
                "
              >
                Service Areas
              </h3>


              <p
                className="
                text-sm
                text-slate-500
                mt-1
                "
              >
                Explore dumpster rental locations nationwide.
              </p>

            </div>



            <button
              className="
              hidden
              md:flex
              items-center
              gap-2
              text-red-600
              font-semibold
              "
            >
              View All
              <ArrowRight size={16}/>
            </button>


          </div>



          <div
            className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
            "
          >

            {totalLocations.slice(0,8).map(city=>(

              <span
                key={city}
                className="
                text-sm
                text-slate-600
                "
              >
                {city}
              </span>

            ))}

          </div>



          <button
            className="
            mt-8
            w-full
            rounded-xl
            bg-blue-700
            py-4
            text-white
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            hover:bg-blue-800
            transition
            "
          >

            View All Service Areas

            <ArrowRight size={18}/>

          </button>


        </div>


      </div>

    </section>
  );
}