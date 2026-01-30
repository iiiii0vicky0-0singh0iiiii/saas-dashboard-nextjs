"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- TYPES ---------------- */
type Project = {
  id: string;
  name: string;
  status: "active" | "completed";
};

type Role = "admin" | "user";

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("user");

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");

  /* ---------------- THEME ---------------- */
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }

      setUserId(data.user.id);
      setUserEmail(data.user.email ?? null);

      // get role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      setRole(profile?.role ?? "user");

      await fetchProjects(data.user.id);
      setLoading(false);
    };

    init();
  }, [router]);

  /* ---------------- DATA ---------------- */
  const fetchProjects = async (uid: string) => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    setProjects(data || []);
  };

  const addProject = async () => {
    if (!projectName || !userId) return;

    await supabase.from("projects").insert({
      name: projectName,
      status: "active",
      user_id: userId,
    });

    setProjectName("");
    fetchProjects(userId);
  };

  const toggleStatus = async (project: Project) => {
    await supabase
      .from("projects")
      .update({
        status: project.status === "active" ? "completed" : "active",
      })
      .eq("id", project.id);

    fetchProjects(userId!);
  };

  const deleteProject = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects(userId!);
  };

  /* ---------------- CHART ---------------- */
  const chartData = [
    { name: "Active", count: projects.filter(p => p.status === "active").length },
    { name: "Completed", count: projects.filter(p => p.status === "completed").length },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white transition">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-64 hidden md:flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-8">🚀 SaaS</h2>

        <nav className="space-y-4">
          <NavItem label="Dashboard" />
          <NavItem label="Projects" />
          {role === "admin" && <NavItem label="Admin Panel" />}
        </nav>

        <div className="mt-auto space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full rounded-lg border px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="w-full rounded-lg bg-red-500/80 text-white px-3 py-2 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <main className="flex-1 p-8 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome 👋
          </h1>
          <p className="text-gray-500">
            {userEmail} · <b className="capitalize">{role}</b>
          </p>
        </div>

        {/* ---------------- STATS ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Projects" value={projects.length} />
          <StatCard title="Active" value={chartData[0].count} />
          <StatCard title="Completed" value={chartData[1].count} />
        </div>

        {/* ---------------- PROJECTS ---------------- */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-6 animate-fade">
          <h2 className="text-xl font-semibold">Projects</h2>

          <div className="flex gap-3">
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="New project"
              className="flex-1 rounded-xl border px-4 py-2 dark:bg-gray-800"
            />
            <button
              onClick={addProject}
              className="rounded-xl bg-indigo-600 text-white px-5 py-2 hover:bg-indigo-700"
            >
              Add
            </button>
          </div>

          <ul className="space-y-3">
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl hover:scale-[1.02] transition"
              >
                <span className="font-medium">{p.name}</span>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => toggleStatus(p)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      p.status === "active"
                        ? "bg-green-500/20 text-green-600"
                        : "bg-blue-500/20 text-blue-600"
                    }`}
                  >
                    {p.status}
                  </button>

                  <button
                    onClick={() => deleteProject(p.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------- CHART ---------------- */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 animate-fade">
          <h2 className="text-xl font-semibold mb-4">Project Overview</h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function NavItem({ label }: { label: string }) {
  return (
    <div className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
      {label}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:scale-[1.03] transition animate-fade">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}
