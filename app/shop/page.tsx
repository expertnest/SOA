"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Disc3,
  Flame,
  Package,
  Play,
  ShoppingBag,
  Sparkles,
  Tag,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

type Filter =
  | "all"
  | "apparel"
  | "music"
  | "accessory"
  | "collectible";

type Product = {
  name: string;
  price: string;
  image: string;
  type: Exclude<
    Filter,
    "all"
  >;
  tag?: string;
  limited?: boolean;
  description: string;
};

type VideoItem = {
  title: string;
  subtitle: string;
  thumbnail: string;
  length: string;
};

// =========================================================
// DATA
// =========================================================

const products: Product[] = [
  {
    name: "Neon Hoodie",
    price: "$80",
    image: "/m1.jpg",
    type: "apparel",
    tag: "Featured",
    limited: true,
    description:
      "Heavyweight oversized hoodie from the Neon collection.",
  },
  {
    name: "Tour Tee",
    price: "$45",
    image: "/m2.jpg",
    type: "apparel",
    tag: "Tour",
    description:
      "Official SOA tour tee with front and back artwork.",
  },
  {
    name: "Vinyl LP",
    price: "$35",
    image: "/m3.jpg",
    type: "music",
    tag: "Physical",
    limited: true,
    description:
      "Collector vinyl pressing with exclusive physical artwork.",
  },
  {
    name: "SOA Cap",
    price: "$30",
    image: "/m4.jpg",
    type: "accessory",
    description:
      "Minimal embroidered SOA cap built for everyday wear.",
  },
  {
    name: "Poster Pack",
    price: "$25",
    image: "/m5.jpg",
    type: "collectible",
    tag: "Collector",
    description:
      "Three-piece visual poster set from the current era.",
  },
  {
    name: "Limited Jacket",
    price: "$120",
    image: "/m6.jpg",
    type: "apparel",
    tag: "Limited",
    limited: true,
    description:
      "Statement outerwear from the limited SOA capsule.",
  },
];

const videos: VideoItem[] = [
  {
    title: "Neon Nights",
    subtitle:
      "Campaign film",
    thumbnail: "/vid1.jpg",
    length: "1:42",
  },
  {
    title: "Afterglow",
    subtitle:
      "Behind the drop",
    thumbnail: "/vid2.jpg",
    length: "2:18",
  },
  {
    title: "Static Dreams",
    subtitle:
      "Visual lookbook",
    thumbnail: "/vid3.jpg",
    length: "1:06",
  },
];

const filters: {
  value: Filter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "apparel",
    label: "Apparel",
  },
  {
    value: "music",
    label: "Music",
  },
  {
    value: "accessory",
    label: "Accessories",
  },
  {
    value: "collectible",
    label: "Collectibles",
  },
];

// =========================================================
// PAGE
// =========================================================

export default function Merch() {
  const [
    filter,
    setFilter,
  ] =
    useState<Filter>("all");

  // ======================================================
  // FILTERED PRODUCTS
  // ======================================================

  const filteredProducts =
    useMemo(() => {
      if (
        filter === "all"
      ) {
        return products;
      }

      return products.filter(
        product =>
          product.type ===
          filter
      );
    }, [filter]);

  // ======================================================
  // FEATURED PRODUCT
  // ======================================================

  const featuredProduct =
    products[0];

  const limitedCount =
    products.filter(
      product =>
        product.limited
    ).length;

  // ======================================================
  // SCROLL TO PRODUCTS
  // ======================================================

  const scrollToShop =
    () => {
      document
        .getElementById(
          "shop-products"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      className="
        relative
        w-full
        bg-[#050506]
        text-white
      "
    >
      {/* ==================================================
          AMBIENCE
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-40
            -top-32
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-600/[0.045]
            blur-[180px]
          "
        />

        <div
          className="
            absolute
            right-[-220px]
            top-[25%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-violet-600/[0.05]
            blur-[190px]
          "
        />

        <div
          className="
            absolute
            bottom-[-260px]
            left-[30%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-purple-600/[0.035]
            blur-[180px]
          "
        />
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1550px]
          px-5
          pb-28
          pt-7
          sm:px-8
          lg:px-10
          xl:px-12
        "
      >
        {/* ==================================================
            PAGE LABEL
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-[9px]
              font-medium
              uppercase
              tracking-[0.21em]
              text-violet-200/40
            "
          >
            <ShoppingBag
              size={12}
            />

            SOA Store
          </div>

          <p
            className="
              hidden
              text-[9px]
              uppercase
              tracking-[0.15em]
              text-white/18
              sm:block
            "
          >
            Official merchandise
          </p>
        </div>

        {/* ==================================================
            FEATURED DROP HERO
        ================================================== */}

        <section
          className="
            relative
            mt-5
            overflow-hidden
            rounded-[32px]
            border
            border-white/[0.07]
            bg-[#09090d]
          "
        >
          <div
            className="
              grid
              lg:grid-cols-[0.9fr_1.1fr]
            "
          >
            {/* ==============================================
                HERO INFO
            ============================================== */}

            <div
              className="
                relative
                flex
                min-h-[430px]
                flex-col
                justify-between
                p-6
                sm:p-8
                lg:min-h-[560px]
                lg:p-10
                xl:p-12
              "
            >
              {/* AMBIENT LIGHT */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -left-20
                  top-10
                  h-72
                  w-72
                  rounded-full
                  bg-blue-600/[0.10]
                  blur-[110px]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  right-0
                  h-72
                  w-72
                  rounded-full
                  bg-violet-600/[0.09]
                  blur-[110px]
                "
              />

              {/* GRID */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  opacity-[0.025]
                  [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)]
                  [background-size:46px_46px]
                "
              />

              {/* TOP */}

              <div
                className="
                  relative
                  z-10
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-violet-400/15
                    bg-violet-500/[0.05]
                    px-3
                    py-1.5
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.16em]
                    text-violet-100/50
                  "
                >
                  <Flame
                    size={10}
                  />

                  Featured Drop
                </span>

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.16em]
                    text-white/20
                  "
                >
                  Limited release
                </span>
              </div>

              {/* MAIN COPY */}

              <div
                className="
                  relative
                  z-10
                  mt-20
                "
              >
                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.20em]
                    text-blue-200/40
                  "
                >
                  SOA / 001
                </p>

                <h1
                  className="
                    mt-3
                    max-w-2xl
                    text-5xl
                    font-black
                    leading-[0.94]
                    tracking-[-0.055em]
                    sm:text-6xl
                    xl:text-7xl
                  "
                >
                  Wear the
                  <span
                    className="
                      block
                      bg-gradient-to-r
                      from-white
                      via-violet-100
                      to-purple-300
                      bg-clip-text
                      text-transparent
                    "
                  >
                    era.
                  </span>
                </h1>

                <p
                  className="
                    mt-5
                    max-w-lg
                    text-sm
                    leading-7
                    text-white/35
                  "
                >
                  Limited apparel,
                  physical music and
                  collectibles designed
                  around each SOA release.
                </p>

                <div
                  className="
                    mt-7
                    flex
                    flex-wrap
                    gap-3
                  "
                >
                  <button
                    type="button"
                    onClick={
                      scrollToShop
                    }
                    className="
                      group
                      inline-flex
                      h-12
                      items-center
                      gap-2
                      rounded-full
                      bg-white
                      px-6
                      text-sm
                      font-semibold
                      text-black
                      transition
                      hover:bg-violet-50
                      active:scale-[0.98]
                    "
                  >
                    Shop the drop

                    <ArrowRight
                      size={14}
                      className="
                        transition-transform
                        group-hover:translate-x-0.5
                      "
                    />
                  </button>

                  <button
                    type="button"
                    className="
                      inline-flex
                      h-12
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-white/[0.10]
                      bg-white/[0.025]
                      px-5
                      text-sm
                      font-medium
                      text-white/55
                      transition
                      hover:border-violet-400/20
                      hover:bg-violet-500/[0.04]
                      hover:text-white
                    "
                  >
                    <Play
                      size={14}
                      fill="currentColor"
                    />

                    Watch campaign
                  </button>
                </div>
              </div>

              {/* HERO META */}

              <div
                className="
                  relative
                  z-10
                  mt-12
                  grid
                  grid-cols-3
                  gap-px
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.05]
                "
              >
                <HeroMeta
                  label="Products"
                  value={
                    String(
                      products.length
                    )
                  }
                />

                <HeroMeta
                  label="Limited"
                  value={
                    String(
                      limitedCount
                    )
                  }
                />

                <HeroMeta
                  label="Categories"
                  value="4"
                />
              </div>
            </div>

            {/* ==============================================
                FEATURED PRODUCT
            ============================================== */}

            <div
              className="
                relative
                min-h-[430px]
                overflow-hidden
                border-t
                border-white/[0.06]
                lg:min-h-[560px]
                lg:border-l
                lg:border-t-0
              "
            >
              <img
                src={
                  featuredProduct.image
                }
                alt={
                  featuredProduct.name
                }
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/90
                  via-black/10
                  to-black/15
                "
              />

              <div
                className="
                  absolute
                  left-5
                  top-5
                  flex
                  gap-2
                "
              >
                <ProductBadge>
                  Limited
                </ProductBadge>

                <ProductBadge>
                  Apparel
                </ProductBadge>
              </div>

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  p-6
                  sm:p-8
                "
              >
                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-6
                  "
                >
                  <div>
                    <p
                      className="
                        text-[9px]
                        uppercase
                        tracking-[0.18em]
                        text-white/30
                      "
                    >
                      Featured piece
                    </p>

                    <h2
                      className="
                        mt-2
                        text-3xl
                        font-bold
                        tracking-[-0.04em]
                      "
                    >
                      {
                        featuredProduct.name
                      }
                    </h2>

                    <p
                      className="
                        mt-2
                        max-w-sm
                        text-xs
                        leading-5
                        text-white/35
                      "
                    >
                      {
                        featuredProduct.description
                      }
                    </p>

                    <p
                      className="
                        mt-4
                        text-lg
                        font-semibold
                        text-white
                      "
                    >
                      {
                        featuredProduct.price
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-black
                      shadow-2xl
                      transition
                      hover:scale-105
                    "
                    aria-label="View featured product"
                  >
                    <ArrowUpRight
                      size={17}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            DROP STRIP
        ================================================== */}

        <section
          className="
            mt-5
            grid
            gap-3
            md:grid-cols-3
          "
        >
          <DropInfoCard
            icon={
              <Flame
                size={16}
              />
            }
            title="Limited drops"
            description="Certain pieces disappear when the run ends."
          />

          <DropInfoCard
            icon={
              <Disc3
                size={16}
              />
            }
            title="Physical music"
            description="Vinyl and collectible releases tied directly to the music."
          />

          <DropInfoCard
            icon={
              <Package
                size={16}
              />
            }
            title="Official SOA"
            description="Everything here comes directly from the SOA catalog."
          />
        </section>

        {/* ==================================================
            PRODUCT SECTION
        ================================================== */}

        <section
          id="shop-products"
          className="
            scroll-mt-6
            mt-14
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.20em]
                  text-violet-200/35
                "
              >
                Store
              </p>

              <h2
                className="
                  mt-1
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                "
              >
                Shop SOA
              </h2>

              <p
                className="
                  mt-2
                  text-xs
                  text-white/25
                "
              >
                Official apparel,
                music and collectibles.
              </p>
            </div>

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.14em]
                text-white/20
              "
            >
              {
                filteredProducts.length
              }{" "}
              products
            </span>
          </div>

          {/* FILTERS */}

          <div
            className="
              mt-6
              flex
              gap-2
              overflow-x-auto
              pb-1
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {filters.map(
              item => (
                <FilterButton
                  key={
                    item.value
                  }
                  active={
                    filter ===
                    item.value
                  }
                  onClick={() =>
                    setFilter(
                      item.value
                    )
                  }
                >
                  {
                    item.label
                  }
                </FilterButton>
              )
            )}
          </div>

          {/* PRODUCTS */}

          <div
            className="
              mt-7
              grid
              gap-x-4
              gap-y-9
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {filteredProducts.map(
              product => (
                <ProductCard
                  key={
                    product.name
                  }
                  product={
                    product
                  }
                />
              )
            )}
          </div>
        </section>

        {/* ==================================================
            COLLECTION FEATURE
        ================================================== */}

        <section
          className="
            mt-16
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.07]
            bg-[#09090c]
          "
        >
          <div
            className="
              grid
              lg:grid-cols-[1fr_1fr]
            "
          >
            {/* IMAGE */}

            <div
              className="
                relative
                min-h-[360px]
                overflow-hidden
              "
            >
              <img
                src="/m6.jpg"
                alt="SOA collection"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-transparent
                  to-[#09090c]/40
                "
              />

              <span
                className="
                  absolute
                  left-5
                  top-5
                  rounded-full
                  border
                  border-white/[0.10]
                  bg-black/30
                  px-3
                  py-1.5
                  text-[8px]
                  uppercase
                  tracking-[0.15em]
                  text-white/50
                  backdrop-blur-xl
                "
              >
                Capsule 001
              </span>
            </div>

            {/* COPY */}

            <div
              className="
                flex
                flex-col
                justify-center
                p-7
                sm:p-9
                lg:p-11
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-violet-400/12
                  bg-violet-500/[0.04]
                  text-violet-200/45
                "
              >
                <Sparkles
                  size={17}
                />
              </div>

              <p
                className="
                  mt-6
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  text-violet-200/35
                "
              >
                SOA Collection
              </p>

              <h2
                className="
                  mt-2
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  sm:text-4xl
                "
              >
                Built around the
                music, not beside it.
              </h2>

              <p
                className="
                  mt-4
                  max-w-lg
                  text-sm
                  leading-7
                  text-white/35
                "
              >
                Every collection can
                live inside the same
                world as the release:
                artwork, visuals,
                physical music and
                wearable pieces.
              </p>

              <button
                type="button"
                onClick={
                  scrollToShop
                }
                className="
                  mt-6
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:text-violet-200
                "
              >
                Explore collection

                <ChevronRight
                  size={14}
                />
              </button>
            </div>
          </div>
        </section>

        {/* ==================================================
            CAMPAIGN FILMS
        ================================================== */}

        <section
          className="
            mt-16
          "
        >
          <div
            className="
              flex
              items-end
              justify-between
              gap-5
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.20em]
                  text-violet-200/35
                "
              >
                Campaign
              </p>

              <h2
                className="
                  mt-1
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                "
              >
                Behind the drop
              </h2>
            </div>

            <span
              className="
                hidden
                items-center
                gap-1.5
                text-[9px]
                uppercase
                tracking-[0.14em]
                text-white/20
                sm:flex
              "
            >
              <Clock3
                size={10}
              />

              Visual archive
            </span>
          </div>

          <div
            className="
              mt-6
              grid
              gap-4
              md:grid-cols-3
            "
          >
            {videos.map(
              video => (
                <CampaignVideoCard
                  key={
                    video.title
                  }
                  video={
                    video
                  }
                />
              )
            )}
          </div>
        </section>

        {/* ==================================================
            FINAL STORE BANNER
        ================================================== */}

        <section
          className="
            relative
            mt-16
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.07]
            bg-[#09090c]
            p-7
            sm:p-9
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-28
              h-72
              w-72
              rounded-full
              bg-violet-600/[0.09]
              blur-[120px]
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  uppercase
                  tracking-[0.17em]
                  text-violet-200/40
                "
              >
                <Tag
                  size={11}
                />

                Direct from SOA
              </div>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-[-0.035em]
                  sm:text-3xl
                "
              >
                Support the world
                behind the music.
              </h2>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-xs
                  leading-6
                  text-white/30
                "
              >
                Music, physical
                releases and merchandise
                can all support SOA
                directly.
              </p>
            </div>

            <button
              type="button"
              onClick={
                scrollToShop
              }
              className="
                inline-flex
                h-11
                w-fit
                items-center
                gap-2
                rounded-full
                bg-white
                px-5
                text-sm
                font-semibold
                text-black
                transition
                hover:bg-violet-50
              "
            >
              Browse store

              <ArrowRight
                size={14}
              />
            </button>
          </div>
        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer
          className="
            mt-14
            flex
            flex-col
            gap-2
            border-t
            border-white/[0.05]
            py-7
            text-[9px]
            text-white/18
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <span>
            SOA Music • Official
            Store
          </span>

          <span>
            Music • Apparel •
            Collectibles
          </span>
        </footer>
      </div>
    </div>
  );
}

// =========================================================
// PRODUCT CARD
// =========================================================

function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <article
      className="
        group
      "
    >
      {/* IMAGE */}

      <div
        className="
          relative
          aspect-[4/5]
          overflow-hidden
          rounded-[22px]
          border
          border-white/[0.06]
          bg-[#0a0a0c]
          transition
          duration-300
          group-hover:border-violet-400/16
        "
      >
        <img
          src={
            product.image
          }
          alt={
            product.name
          }
          className="
            h-full
            w-full
            object-cover
            transition
            duration-700
            group-hover:scale-[1.025]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/65
            via-transparent
            to-transparent
            opacity-60
          "
        />

        {/* BADGES */}

        <div
          className="
            absolute
            left-3
            top-3
            flex
            flex-wrap
            gap-2
          "
        >
          {product.tag && (
            <ProductBadge>
              {
                product.tag
              }
            </ProductBadge>
          )}

          {product.limited && (
            <span
              className="
                rounded-full
                border
                border-violet-300/18
                bg-violet-500/[0.10]
                px-2.5
                py-1
                text-[8px]
                uppercase
                tracking-[0.11em]
                text-violet-100/65
                backdrop-blur-xl
              "
            >
              Limited
            </span>
          )}
        </div>

        {/* VIEW ACTION */}

        <button
          type="button"
          className="
            absolute
            bottom-4
            right-4
            flex
            h-11
            w-11
            translate-y-3
            items-center
            justify-center
            rounded-full
            bg-white
            text-black
            opacity-0
            shadow-2xl
            transition
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
          aria-label={`View ${product.name}`}
        >
          <ArrowUpRight
            size={15}
          />
        </button>
      </div>

      {/* INFO */}

      <div
        className="
          px-1
          pt-4
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-5
          "
        >
          <div
            className="
              min-w-0
            "
          >
            <h3
              className="
                truncate
                text-sm
                font-semibold
                text-white/80
                transition
                group-hover:text-white
              "
            >
              {
                product.name
              }
            </h3>

            <p
              className="
                mt-1
                line-clamp-2
                text-[10px]
                leading-5
                text-white/25
              "
            >
              {
                product.description
              }
            </p>
          </div>

          <span
            className="
              shrink-0
              text-sm
              font-semibold
              text-white/75
            "
          >
            {
              product.price
            }
          </span>
        </div>

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            border-t
            border-white/[0.05]
            pt-3
          "
        >
          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.13em]
              text-white/18
            "
          >
            {formatType(
              product.type
            )}
          </span>

          <button
            type="button"
            className="
              text-[9px]
              font-medium
              text-white/35
              transition
              hover:text-violet-200
            "
          >
            View product
          </button>
        </div>
      </div>
    </article>
  );
}

// =========================================================
// CAMPAIGN VIDEO
// =========================================================

function CampaignVideoCard({
  video,
}: {
  video: VideoItem;
}) {
  return (
    <button
      type="button"
      className="
        group
        text-left
      "
    >
      <div
        className="
          relative
          aspect-video
          overflow-hidden
          rounded-[20px]
          border
          border-white/[0.06]
          bg-[#09090b]
        "
      >
        <img
          src={
            video.thumbnail
          }
          alt={
            video.title
          }
          className="
            h-full
            w-full
            object-cover
            transition
            duration-700
            group-hover:scale-105
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-black/25
            transition
            group-hover:bg-black/45
          "
        />

        {/* PLAY */}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              scale-90
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              opacity-0
              shadow-2xl
              transition
              duration-300
              group-hover:scale-100
              group-hover:opacity-100
            "
          >
            <Play
              size={14}
              fill="currentColor"
              className="ml-px"
            />
          </div>
        </div>

        <span
          className="
            absolute
            bottom-3
            right-3
            rounded-md
            bg-black/70
            px-2
            py-1
            text-[8px]
            text-white/55
            backdrop-blur-xl
          "
        >
          {
            video.length
          }
        </span>
      </div>

      <p
        className="
          mt-3
          text-sm
          font-semibold
          text-white/70
          transition
          group-hover:text-white
        "
      >
        {
          video.title
        }
      </p>

      <p
        className="
          mt-1
          text-[9px]
          uppercase
          tracking-[0.12em]
          text-white/20
        "
      >
        {
          video.subtitle
        }
      </p>
    </button>
  );
}

// =========================================================
// DROP INFO CARD
// =========================================================

function DropInfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-4
        rounded-2xl
        border
        border-white/[0.055]
        bg-white/[0.016]
        p-4
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-violet-400/10
          bg-violet-500/[0.035]
          text-violet-200/35
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-xs
            font-medium
            text-white/60
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-[9px]
            leading-4
            text-white/22
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

// =========================================================
// HERO META
// =========================================================

function HeroMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        bg-[#09090d]/85
        px-4
        py-3
      "
    >
      <p
        className="
          text-lg
          font-semibold
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-[8px]
          uppercase
          tracking-[0.12em]
          text-white/20
        "
      >
        {label}
      </p>
    </div>
  );
}

// =========================================================
// FILTER
// =========================================================

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        whitespace-nowrap
        rounded-full
        border
        px-4
        py-2
        text-[10px]
        font-medium
        transition

        ${
          active
            ? `
              border-violet-400/18
              bg-violet-500/[0.08]
              text-violet-100
            `
            : `
              border-white/[0.06]
              bg-white/[0.018]
              text-white/35
              hover:border-white/[0.10]
              hover:bg-white/[0.04]
              hover:text-white/70
            `
        }
      `}
    >
      {children}
    </button>
  );
}

// =========================================================
// PRODUCT BADGE
// =========================================================

function ProductBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      className="
        rounded-full
        border
        border-white/[0.10]
        bg-black/40
        px-2.5
        py-1
        text-[8px]
        uppercase
        tracking-[0.11em]
        text-white/50
        backdrop-blur-xl
      "
    >
      {children}
    </span>
  );
}

// =========================================================
// FORMAT TYPE
// =========================================================

function formatType(
  type: Product["type"]
) {
  switch (type) {
    case "apparel":
      return "Apparel";

    case "music":
      return "Physical Music";

    case "accessory":
      return "Accessory";

    case "collectible":
      return "Collectible";

    default:
      return "Product";
  }
}