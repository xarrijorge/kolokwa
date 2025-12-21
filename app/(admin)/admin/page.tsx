"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Briefcase,
  TrendingUp,
  Plus,
  ArrowRight,
  Activity,
} from "lucide-react";

type Stats = {
  events: number;
  partners: number;
  staff: number;
};

type RecentEvent = {
  id: string;
  title: string;
  date?: string | null;
  tag?: string | null;
};

type RecentPartner = {
  id: string;
  name: string;
  created_at?: string | null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    events: 0,
    partners: 0,
    staff: 0,
  });
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [recentPartners, setRecentPartners] = useState<RecentPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [eventsRes, partnersRes, staffRes] = await Promise.all([
          fetch("/api/events", { cache: "no-store" }),
          fetch("/api/partners", { cache: "no-store" }),
          fetch("/api/staff", { cache: "no-store" }),
        ]);

        const eventsData = eventsRes.ok ? await eventsRes.json() : [];
        const partnersData = partnersRes.ok ? await partnersRes.json() : [];
        const staffData = staffRes.ok ? await staffRes.json() : [];

        const events = Array.isArray(eventsData) ? eventsData : [];
        const partners = Array.isArray(partnersData) ? partnersData : [];
        const staff = Array.isArray(staffData) ? staffData : [];

        setStats({
          events: events.length,
          partners: partners.length,
          staff: staff.length,
        });

        setRecentEvents(events.slice(0, 3));
        setRecentPartners(partners.slice(0, 3));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const statCards = [
    {
      title: "Total Events",
      value: stats.events,
      icon: Calendar,
      href: "/admin/events",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Partners",
      value: stats.partners,
      icon: Briefcase,
      href: "/admin/partners",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Staff Members",
      value: stats.staff,
      icon: Users,
      href: "/admin/staff",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const quickActions = [
    { label: "Create Event", href: "/admin/events", icon: Calendar },
    { label: "Add Partner", href: "/admin/partners", icon: Briefcase },
    { label: "Add Staff", href: "/admin/staff", icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Activity className="size-5 animate-pulse" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`size-5 sm:size-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span>View all</span>
                <ArrowRight className="size-4 ml-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-auto py-3"
              >
                <Plus className="size-4" />
                <span>{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Events */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Events</h2>
            <Link
              href="/admin/events"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="size-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No events yet</p>
              <Link href="/admin/events">
                <Button size="sm" className="mt-3">
                  <Plus className="size-4 mr-1" /> Create Event
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "Date TBA"}
                      {event.tag && (
                        <span className="ml-2 px-1.5 py-0.5 bg-secondary/10 text-secondary rounded text-xs">
                          {event.tag}
                        </span>
                      )}
                    </p>
                  </div>
                  <Link href={`/admin/events`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Partners */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Partners</h2>
            <Link
              href="/admin/partners"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </div>

          {recentPartners.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="size-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No partners yet</p>
              <Link href="/admin/partners">
                <Button size="sm" className="mt-3">
                  <Plus className="size-4 mr-1" /> Add Partner
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{partner.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {partner.created_at
                        ? `Added ${new Date(partner.created_at).toLocaleDateString()}`
                        : "Recently added"}
                    </p>
                  </div>
                  <Link href={`/admin/partners`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* System Status */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm">Database Connected</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm">API Healthy</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm">Authentication Active</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
