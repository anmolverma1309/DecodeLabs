"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LayoutDashboard, Users, Activity, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Mock Data for Charts
const categoryData = [
  { name: "Sci-Fi", value: 400 },
  { name: "Programming", value: 300 },
  { name: "Drama", value: 300 },
  { name: "Action", value: 200 },
  { name: "Business", value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const interactionData = [
  { name: "Mon", likes: 40, views: 240, favs: 20 },
  { name: "Tue", likes: 30, views: 139, favs: 15 },
  { name: "Wed", likes: 20, views: 980, favs: 40 },
  { name: "Thu", likes: 27, views: 390, favs: 25 },
  { name: "Fri", likes: 18, views: 480, favs: 18 },
  { name: "Sat", likes: 23, views: 380, favs: 22 },
  { name: "Sun", likes: 34, views: 430, favs: 30 },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && (session?.user as any)?.role !== "ADMIN")) {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      // Simulate data fetch
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [status, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-8 text-white flex flex-col gap-8">
        <Skeleton className="h-10 w-48 bg-white/10" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full bg-white/10" />
          <Skeleton className="h-32 w-full bg-white/10" />
          <Skeleton className="h-32 w-full bg-white/10" />
          <Skeleton className="h-32 w-full bg-white/10" />
        </div>
        <Skeleton className="h-96 w-full bg-white/10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LayoutDashboard className="text-primary" /> Admin Panel
            </h1>
            <p className="text-white/50 mt-1">Platform metrics and recommendation engine insights.</p>
          </div>
        </header>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Users", value: "1,248", icon: Users, color: "text-blue-500" },
            { title: "Total Items", value: "8,432", icon: Package, color: "text-green-500" },
            { title: "Daily Interactions", value: "32.4K", icon: Activity, color: "text-purple-500" },
            { title: "Avg Match Rate", value: "84%", icon: LayoutDashboard, color: "text-yellow-500" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white/60">{stat.title}</CardTitle>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Interactions Over Time</CardTitle>
                <CardDescription>Views vs Likes vs Favorites</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interactionData}>
                    <XAxis dataKey="name" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} 
                      itemStyle={{ color: '#fff' }} 
                    />
                    <Bar dataKey="views" fill="#8884d8" stackId="a" />
                    <Bar dataKey="likes" fill="#82ca9d" stackId="a" />
                    <Bar dataKey="favs" fill="#ffc658" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Distribution of user preferences</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
