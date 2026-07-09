"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Music2,
  Headphones,
  Flame,
  Clock3,
  Settings,
  Mail,
  Lock,
  AlertTriangle,
  User,
} from "lucide-react";

/* ================= TYPES ================= */

type Track = {
  name: string;
  plays: string;
};

type Playlist = {
  title: string;
  tracks: number;
};

/* ================= FLAG ================= */

function getFlagEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

const countryCodes = [
  "US","CA","GB","FR","DE","IT","ES","JP","KR","CN","IN","BR","MX","AU","NZ",
  "AR","CL","CO","PE","VE","ZA","EG","NG","KE","MA","SA","AE","TR","RU","UA",
  "SE","NO","DK","FI","NL","BE","CH","AT","PL","CZ","HU","RO","GR","PT","IE",
  "TH","VN","PH","ID","MY","SG","PK","BD","LK","IR","IQ","IL","QA","KW",
];

const avatarOptions = ["🧊","🔥","🌙","⚡","🌀","🌌","🎧","👾"];

/* ================= MOCK DATA ================= */ 

const playlists: any[] = [];
const recentTracks: any[] = [];

export default function Profile() {
  const { user } = useUser();

  // ===============================
  // REAL CONVEX USER
  // ===============================
  const dbUser = useQuery(
    api.users.getByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const updateUser = useMutation(api.users.updateProfile);

  const [name, setName] = useState("Nox Listener");
  const [username, setUsername] = useState("noxfan");
  const [avatar, setAvatar] = useState("🌙");
  const [flag, setFlag] = useState("US");

  const [email, setEmail] = useState("user@email.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ===============================
  // SYNC DB → UI
  // ===============================
  useEffect(() => {
    if (!dbUser) return;

    setName(dbUser.displayName ?? "Nox Listener");
    setUsername(dbUser.username ?? "noxfan");
    setEmail(dbUser.email ?? "");
    setAvatar(dbUser.avatar ?? "🌙");
    setFlag(dbUser.countryCode ?? "US");
  }, [dbUser]);

  // ===============================
  // SAVE PROFILE → DB
  // ===============================
  const saveProfile = async () => {
    if (!user?.id) return;

    await updateUser({
      clerkId: user.id,
      displayName: name,
      username,
      email,
      avatar,
      countryCode: flag,
    });
  };

  const stats = [
    { title: "Time Listened", value: "312 hrs", icon: Clock3 },
    { title: "Tracks Played", value: "4,281", icon: Music2 },
    { title: "Listening Streak", value: "28 days", icon: Flame },
    { title: "Artists", value: "134", icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* BG */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[180px]" />
      </div>

      <div className="mx-auto max-w-6xl p-4 sm:p-6 flex flex-col gap-6">

        {/* PROFILE HEADER */}
        <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

            {/* AVATAR */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white/5 text-5xl">
                {avatar}
                <span className="absolute bottom-2 right-2 text-xl">
                  {getFlagEmoji(flag)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {avatarOptions.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`rounded-xl px-3 py-2 ${
                      avatar === a ? "bg-white text-black" : "bg-white/5"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>

              {/* SAVE BUTTON */}
              <button
                onClick={saveProfile}
                className="mt-2 bg-purple-500 px-4 py-2 rounded-full text-sm font-bold"
              >
                Save Profile
              </button>
            </div>

            {/* INFO */}
            <div className="flex-1 w-full">
              <div className="grid gap-4 sm:grid-cols-1">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                  placeholder="Display Name"
                />
              </div>

              <div className="mt-5 grid grid-cols-8 gap-2">
                {countryCodes.map((code) => (
                  <button
                    key={code}
                    onClick={() => setFlag(code)}
                    className={`text-lg ${
                      flag === code
                        ? "scale-125"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    {getFlagEmoji(code)}
                  </button>
                ))}
              </div>

              <div className="mt-5 text-sm text-zinc-400">
                {name} @{username} {getFlagEmoji(flag)}
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <Icon size={18} className="text-purple-300" />
                <h3 className="mt-3 text-xl font-black">{stat.value}</h3>
                <p className="text-xs text-zinc-500">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* SUBSCRIPTION */}
        <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-purple-900/20 to-black p-6">
          <h2 className="text-2xl font-bold mb-4">Your Plan</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Free Plan</p>
              <p className="text-sm text-zinc-400">Ads • Limited skips</p>
            </div>
            <button className="bg-purple-500 px-5 py-2 rounded-full text-sm font-bold">
              Upgrade
            </button>
          </div>
        </div>

        {/* QUICK LIBRARY */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-pink-500/30 to-purple-500/30 p-5">
            <h3 className="font-bold">Liked Songs</h3>
            <p className="text-xs text-zinc-300">128 tracks</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-500/30 to-blue-500/30 p-5">
            <h3 className="font-bold">Top Artists</h3>
            <p className="text-xs text-zinc-300">This month</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 p-5">
            <h3 className="font-bold">Downloads</h3>
            <p className="text-xs text-zinc-300">Offline</p>
          </div>
        </div>

        {/* PLAYLISTS */}
        <div className="rounded-[34px] border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {playlists.map((p, i) => (
              <div key={i} className="rounded-2xl bg-white/5 p-4">
                <div className="h-28 rounded-xl bg-purple-500/20 flex items-center justify-center text-3xl">
                  🎶
                </div>
                <h3 className="mt-3">{p.title}</h3>
                <p className="text-xs text-zinc-400">{p.tracks} tracks</p>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT */}
        <div className="rounded-[34px] border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
          {recentTracks.map((t, i) => (
            <div key={i} className="flex justify-between bg-white/5 p-3 rounded-xl mb-2">
              <span>{t.name}</span>
              <span className="text-xs text-zinc-400">{t.plays}</span>
            </div>
          ))}
        </div>

        {/* ACCOUNT SETTINGS */}
        <AccountSettings
          email={email}
          setEmail={setEmail}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
        />

        {/* DANGER */}
        <div className="rounded-[34px] border border-red-500/30 bg-red-500/5 p-6">
          <h2 className="text-red-400 font-bold mb-4 flex gap-2 items-center">
            <AlertTriangle size={18} /> Danger Zone
          </h2>

          <button className="bg-red-500 px-5 py-2 rounded-full text-sm font-bold">
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}

/* ================= ACCOUNT SETTINGS ================= */

function AccountSettings({
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  newPassword,
  setNewPassword,
}: any) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-zinc-950 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={18} />
        <h2 className="text-2xl font-bold">Account Settings</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">

        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-500 flex items-center gap-2">
            <Mail size={14} /> Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-500 flex items-center gap-2">
            <User size={14} /> Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-xs text-zinc-500 flex items-center gap-2">
            <Lock size={14} /> Change Password
          </label>

          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="password"
              placeholder="Current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            />
          </div>
        </div>

      </div>
    </div>
  );
}