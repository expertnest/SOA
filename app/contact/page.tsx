"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  Center,
  Environment,
} from "@react-three/drei";

import {
  ArrowUpRight,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react";

import * as THREE from "three";

import Loader from "../../components/loader";
import Logo from "../../model/logo";

// =========================================================
// CLIENT WIDTH
// =========================================================

function useIsMountedWidth() {
  const [
    width,
    setWidth,
  ] = useState<number | null>(
    null
  );

  useEffect(() => {
    const update = () => {
      setWidth(
        window.innerWidth
      );
    };

    update();

    window.addEventListener(
      "resize",
      update
    );

    return () => {
      window.removeEventListener(
        "resize",
        update
      );
    };
  }, []);

  return width;
}

// =========================================================
// PARTICLES
// =========================================================

function Particles() {
  const ref =
    useRef<THREE.Points>(
      null
    );

  const count = 700;

  const positions =
    useMemo(() => {
      const array =
        new Float32Array(
          count * 3
        );

      for (
        let index = 0;
        index < count;
        index++
      ) {
        array[index * 3] =
          (Math.random() -
            0.5) *
          20;

        array[
          index * 3 + 1
        ] =
          (Math.random() -
            0.5) *
          20;

        array[
          index * 3 + 2
        ] =
          (Math.random() -
            0.5) *
          20;
      }

      return array;
    }, []);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y +=
      0.00035;

    ref.current.rotation.x =
      Math.sin(
        state.clock
          .elapsedTime *
          0.05
      ) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[
            positions,
            3,
          ]}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.025}
        color="#a1a1aa"
        transparent
        opacity={0.42}
        depthWrite={false}
      />
    </points>
  );
}

// =========================================================
// 3D LOGO
// =========================================================

function MouseFollower({
  width,
}: {
  width: number | null;
}) {
  const ref =
    useRef<THREE.Group>(
      null
    );

  const isMobile =
    width !== null &&
    width < 768;

  const isDesktop =
    width !== null &&
    width >= 768;

  const scale =
    useMemo(() => {
      if (width === null) {
        return 1.35;
      }

      if (width < 480) {
        return 1.05;
      }

      if (width < 768) {
        return 1.3;
      }

      return 1.22;
    }, [width]);

  useFrame(
    ({
      mouse,
      clock,
    }) => {
      if (!ref.current) {
        return;
      }

      const time =
        clock.elapsedTime;

      ref.current.rotation.x =
        THREE.MathUtils.lerp(
          ref.current
            .rotation.x,

          -mouse.y *
            0.22 +
            Math.sin(
              time * 0.6
            ) *
              0.045,

          0.06
        );

      ref.current.rotation.y =
        THREE.MathUtils.lerp(
          ref.current
            .rotation.y,

          mouse.x *
            0.22 +
            Math.cos(
              time * 0.5
            ) *
              0.045,

          0.06
        );

      const breathe =
        1 +
        Math.sin(
          time * 1.15
        ) *
          0.025;

      ref.current.scale.set(
        scale * breathe,
        scale * breathe,
        scale * breathe
      );
    }
  );

  return (
    <group
      ref={ref}
      position={
        isDesktop
          ? [0, 0.25, 0]
          : isMobile
            ? [0, 0.18, 0]
            : [0, 0, 0]
      }
    >
      <Center>
        <Logo />
      </Center>
    </group>
  );
}

// =========================================================
// PAGE
// =========================================================

export default function Home() {
  const width =
    useIsMountedWidth();

  // =======================================================
  // HYDRATION GUARD
  // =======================================================

  if (width === null) {
    return (
      <div
        className="
          flex
          min-h-[620px]
          w-full
          items-center
          justify-center
          bg-[#15171c]
          text-white
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            text-white/35
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              animate-pulse
              rounded-full
              bg-violet-300
            "
          />

          Loading SOA...
        </div>
      </div>
    );
  }

  const isMobile =
    width < 768;

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#15171c]
        text-white
      "
    >
      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* BASE GRADIENT */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-[#1a1d23]
            via-[#15171c]
            to-[#111318]
          "
        />

        {/* TOP GLOW */}

        <div
          className="
            absolute
            left-1/2
            top-[-280px]
            h-[620px]
            w-[760px]
            -translate-x-1/2
            rounded-full
            bg-violet-600/[0.10]
            blur-[180px]
          "
        />

        {/* BLUE GLOW */}

        <div
          className="
            absolute
            -left-[220px]
            top-[28%]
            h-[480px]
            w-[480px]
            rounded-full
            bg-blue-600/[0.055]
            blur-[170px]
          "
        />

        {/* PURPLE GLOW */}

        <div
          className="
            absolute
            -right-[220px]
            bottom-[-80px]
            h-[520px]
            w-[520px]
            rounded-full
            bg-purple-600/[0.06]
            blur-[180px]
          "
        />

        {/* GRID */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)]
            [background-size:58px_58px]
          "
        />

        {/* TOP SHEEN */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-52
            bg-gradient-to-b
            from-white/[0.025]
            to-transparent
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
          flex
          w-full
          max-w-[1320px]
          flex-col
          items-center
          px-5
          pb-32
          pt-8
          sm:px-8
          lg:px-10
        "
      >
        {/* ==================================================
            INTRO
        ================================================== */}

        <div
          className="
            mb-1
            flex
            flex-col
            items-center
            text-center
          "
        >
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-violet-400/15
              bg-violet-500/[0.055]
              px-3
              py-1.5
              text-[9px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-violet-100/60
            "
          >
            <Sparkles
              size={11}
            />

            SOA Music
          </div>

          <h1
            className="
              mt-4
              text-3xl
              font-bold
              tracking-[-0.05em]
              sm:text-4xl
              lg:text-5xl
            "
          >
            Let&apos;s talk.
          </h1>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-white/40
            "
          >
            Music, business,
            collaborations or
            anything SOA — send
            us a message.
          </p>
        </div>

        {/* ==================================================
            3D EXPERIENCE
        ================================================== */}

        <div
          className="
            relative
            w-full
          "
          style={{
            height:
              isMobile
                ? "330px"
                : "430px",
            marginBottom:
              isMobile
                ? "-64px"
                : "-95px",
          }}
        >
          {/* LOGO FLOOR GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-[22%]
              left-1/2
              h-20
              w-[55%]
              -translate-x-1/2
              rounded-full
              bg-violet-500/[0.12]
              blur-[55px]
            "
          />

          <Canvas
            camera={{
              position: [
                0,
                0,
                5,
              ],
              fov: 50,
            }}
            dpr={[
              1,
              1.5,
            ]}
          >
            <Suspense
              fallback={
                <Loader />
              }
            >
              <ambientLight
                intensity={
                  0.45
                }
              />

              <directionalLight
                position={[
                  5,
                  5,
                  5,
                ]}
                intensity={
                  1.15
                }
              />

              <pointLight
                position={[
                  0,
                  3,
                  6,
                ]}
                intensity={
                  1.25
                }
              />

              <Particles />

              <MouseFollower
                width={
                  width
                }
              />

              <Environment
                preset="city"
              />
            </Suspense>
          </Canvas>
        </div>

        {/* ==================================================
            CONTACT WORKSPACE
        ================================================== */}

        <div
          className="
            grid
            w-full
            max-w-5xl
            gap-4
            lg:grid-cols-[0.72fr_1.28fr]
          "
        >
          {/* ==================================================
              CONTACT INFO
          ================================================== */}

          <aside
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-white/[0.08]
              bg-[#181a20]/95
              p-6
              shadow-[0_24px_70px_rgba(0,0,0,0.20)]
              backdrop-blur-2xl
              sm:p-7
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -left-20
                -top-24
                h-56
                w-56
                rounded-full
                bg-blue-500/[0.07]
                blur-[90px]
              "
            />

            <div
              className="
                relative
                z-10
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-violet-400/15
                  bg-violet-500/[0.06]
                  text-violet-100/65
                "
              >
                <MessageSquare
                  size={18}
                />
              </div>

              <p
                className="
                  mt-6
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-white/30
                "
              >
                Contact SOA
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-[-0.035em]
                "
              >
                Start a
                conversation.
              </h2>

              <p
                className="
                  mt-3
                  max-w-sm
                  text-xs
                  leading-6
                  text-white/40
                "
              >
                Reach out about
                music, releases,
                collaborations,
                business or the
                SOA platform.
              </p>

              <div
                className="
                  my-7
                  h-px
                  bg-white/[0.07]
                "
              />

              <div
                className="
                  space-y-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.035]
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
                      bg-white/[0.055]
                      text-white/55
                    "
                  >
                    <Mail
                      size={15}
                    />
                  </div>

                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        text-[8px]
                        uppercase
                        tracking-[0.14em]
                        text-white/25
                      "
                    >
                      Message
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-xs
                        font-medium
                        text-white/65
                      "
                    >
                      Send through
                      the form
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.035]
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
                      bg-white/[0.055]
                      text-white/55
                    "
                  >
                    <ArrowUpRight
                      size={15}
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[8px]
                        uppercase
                        tracking-[0.14em]
                        text-white/25
                      "
                    >
                      SOA
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        font-medium
                        text-white/65
                      "
                    >
                      Independent.
                      Direct.
                      Artist-first.
                    </p>
                  </div>
                </div>
              </div>

              <p
                className="
                  mt-6
                  text-[9px]
                  leading-5
                  text-white/25
                "
              >
                We&apos;ll get back
                to you as soon as
                possible.
              </p>
            </div>
          </aside>

          {/* ==================================================
              FORM
          ================================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-white/[0.09]
              bg-[#1b1d23]/95
              p-6
              shadow-[0_28px_80px_rgba(0,0,0,0.22)]
              backdrop-blur-2xl
              sm:p-8
            "
          >
            {/* FORM AMBIENCE */}

            <div
              className="
                pointer-events-none
                absolute
                right-[-100px]
                top-[-120px]
                h-72
                w-72
                rounded-full
                bg-violet-600/[0.08]
                blur-[100px]
              "
            />

            <div
              className="
                relative
                z-10
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-2
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
                      tracking-[0.17em]
                      text-violet-200/45
                    "
                  >
                    Send a message
                  </p>

                  <h2
                    className="
                      mt-1.5
                      text-2xl
                      font-semibold
                      tracking-[-0.035em]
                    "
                  >
                    Get in touch
                  </h2>
                </div>

                <div
                  className="
                    hidden
                    items-center
                    gap-2
                    text-[9px]
                    text-white/25
                    sm:flex
                  "
                >
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-violet-300
                      shadow-[0_0_8px_rgba(196,181,253,0.65)]
                    "
                  />

                  SOA contact
                </div>
              </div>

              {/* FIELDS */}

              <div
                className="
                  mt-7
                  grid
                  gap-4
                  sm:grid-cols-2
                "
              >
                <ContactField
                  label="Your name"
                >
                  <input
                    type="text"
                    placeholder="Name"
                    className={
                      inputClass
                    }
                  />
                </ContactField>

                <ContactField
                  label="Your email"
                >
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className={
                      inputClass
                    }
                  />
                </ContactField>
              </div>

              <div
                className="
                  mt-4
                "
              >
                <ContactField
                  label="Message"
                >
                  <textarea
                    rows={6}
                    placeholder="Tell us what's on your mind..."
                    className={`${inputClass} min-h-[150px] resize-none py-4`}
                  />
                </ContactField>
              </div>

              {/* FOOTER */}

              <div
                className="
                  mt-6
                  flex
                  flex-col
                  gap-4
                  border-t
                  border-white/[0.07]
                  pt-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <p
                  className="
                    max-w-sm
                    text-[9px]
                    leading-5
                    text-white/25
                  "
                >
                  By sending this
                  message, you&apos;re
                  contacting SOA Music
                  directly.
                </p>

                <button
                  type="button"
                  className="
                    inline-flex
                    h-11
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-5
                    text-sm
                    font-semibold
                    text-black
                    shadow-[0_10px_30px_rgba(0,0,0,0.20)]
                    transition
                    duration-200
                    hover:scale-[1.015]
                    hover:bg-violet-50
                    active:scale-[0.98]
                  "
                >
                  <Send
                    size={14}
                  />

                  Send message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            BOTTOM LINE
        ================================================== */}

        <div
          className="
            mt-12
            flex
            items-center
            gap-3
            text-[8px]
            uppercase
            tracking-[0.20em]
            text-white/20
          "
        >
          <span
            className="
              h-px
              w-8
              bg-white/10
            "
          />

          Sounds of Art

          <span
            className="
              h-px
              w-8
              bg-white/10
            "
          />
        </div>
      </div>
    </section>
  );
}

// =========================================================
// CONTACT FIELD
// =========================================================

function ContactField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className="
        block
      "
    >
      <span
        className="
          mb-2
          block
          text-[9px]
          font-medium
          uppercase
          tracking-[0.13em]
          text-white/35
        "
      >
        {label}
      </span>

      {children}
    </label>
  );
}

// =========================================================
// INPUT STYLE
// =========================================================

const inputClass = `
  w-full
  rounded-xl
  border
  border-white/[0.08]
  bg-[#14171d]
  px-4
  py-3
  text-sm
  text-white
  outline-none
  transition
  placeholder:text-white/20

  hover:border-white/[0.12]
  hover:bg-[#161920]

  focus:border-violet-400/30
  focus:bg-[#171a21]
  focus:ring-4
  focus:ring-violet-500/[0.045]
`;