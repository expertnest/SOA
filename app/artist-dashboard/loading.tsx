export default function Loading() {
    return (
      <main className="relative w-full overflow-hidden bg-[#15171c] px-4 py-6 text-white sm:px-6 lg:px-8">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-violet-500/[0.06] blur-3xl" />
          <div className="absolute left-[10%] top-[520px] h-[280px] w-[280px] rounded-full bg-blue-500/[0.03] blur-3xl" />
        </div>
  
        <div className="relative mx-auto w-full max-w-[1500px] animate-pulse">
          {/* TOP HEADER */}
          <div className="flex flex-col gap-4 border-b border-violet-400/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl border border-violet-300/10 bg-white/[0.05]" />
  
              <div>
                <div className="h-3.5 w-24 rounded-full bg-white/[0.08]" />
                <div className="mt-2 h-2.5 w-16 rounded-full bg-white/[0.04]" />
              </div>
            </div>
  
            <div className="flex gap-2">
              <div className="h-8 w-20 rounded-lg bg-white/[0.045]" />
              <div className="h-8 w-16 rounded-lg bg-white/[0.045]" />
              <div className="h-8 w-20 rounded-lg bg-white/[0.045]" />
            </div>
          </div>
  
          {/* HERO */}
          <section className="mt-6 overflow-hidden rounded-[30px] border border-violet-400/15 bg-[#0b0c12] shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
            <div className="relative min-h-[390px] p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.035] via-transparent to-violet-500/[0.05]" />
  
              <div className="relative flex h-full min-h-[330px] flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-7 w-36 rounded-full border border-white/[0.05] bg-white/[0.04]" />
                  <div className="hidden h-7 w-20 rounded-full bg-white/[0.04] sm:block" />
                </div>
  
                <div className="mt-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                    {/* Artist image */}
                    <div className="h-32 w-32 rounded-[26px] border border-violet-400/15 bg-white/[0.05] sm:h-40 sm:w-40" />
  
                    <div className="pb-1">
                      <div className="h-2.5 w-24 rounded-full bg-white/[0.05]" />
  
                      <div className="mt-4 h-12 w-56 rounded-xl bg-white/[0.075] sm:h-14 sm:w-72" />
  
                      <div className="mt-4 h-3 w-full max-w-[420px] rounded-full bg-white/[0.045]" />
                      <div className="mt-2 h-3 w-[80%] rounded-full bg-white/[0.035]" />
                    </div>
                  </div>
  
                  <div className="flex gap-3">
                    <div className="h-12 w-36 rounded-xl border border-white/[0.06] bg-white/[0.04]" />
                    <div className="h-12 w-36 rounded-xl bg-violet-500/[0.12]" />
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* STATS */}
          <section className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/[0.07] bg-[#1b1d23] p-4"
              >
                <div className="h-2.5 w-20 rounded-full bg-white/[0.04]" />
  
                <div className="mt-4 h-7 w-24 rounded-lg bg-white/[0.07]" />
  
                <div className="mt-3 h-2.5 w-16 rounded-full bg-white/[0.035]" />
              </div>
            ))}
          </section>
  
          {/* MAIN GRID */}
          <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
            {/* Recent releases */}
            <div className="rounded-[26px] border border-white/[0.07] bg-[#1b1d23] p-5 sm:p-6">
              <div className="flex items-end justify-between">
                <div>
                  <div className="h-2.5 w-16 rounded-full bg-white/[0.04]" />
                  <div className="mt-3 h-6 w-40 rounded-lg bg-white/[0.065]" />
                </div>
  
                <div className="h-4 w-14 rounded-full bg-white/[0.04]" />
              </div>
  
              <div className="mt-6 space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3"
                  >
                    <div className="h-14 w-14 shrink-0 rounded-lg bg-white/[0.05]" />
  
                    <div className="flex-1">
                      <div className="h-3.5 w-40 rounded-full bg-white/[0.06]" />
                      <div className="mt-2 h-2.5 w-24 rounded-full bg-white/[0.035]" />
                    </div>
  
                    <div className="h-6 w-14 rounded-full bg-white/[0.035]" />
                  </div>
                ))}
              </div>
            </div>
  
            {/* Right column */}
            <div className="space-y-6">
              <div className="rounded-[26px] border border-white/[0.07] bg-[#1b1d23] p-6">
                <div className="h-2.5 w-16 rounded-full bg-white/[0.04]" />
                <div className="mt-3 h-6 w-36 rounded-lg bg-white/[0.065]" />
  
                <div className="mt-8 h-10 w-20 rounded-lg bg-white/[0.075]" />
  
                <div className="mt-5 h-2 w-full rounded-full bg-white/[0.04]" />
  
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="h-20 rounded-xl bg-white/[0.035]" />
                  <div className="h-20 rounded-xl bg-white/[0.035]" />
                </div>
              </div>
  
              <div className="rounded-[26px] border border-white/[0.07] bg-[#1b1d23] p-6">
                <div className="h-2.5 w-16 rounded-full bg-white/[0.04]" />
                <div className="mt-3 h-6 w-36 rounded-lg bg-white/[0.065]" />
  
                <div className="mt-6 space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <div className="h-7 w-7 rounded-lg bg-white/[0.045]" />
                      <div className="h-3 flex-1 rounded-full bg-white/[0.035]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }