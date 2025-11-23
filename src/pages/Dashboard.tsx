import React, { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  Users,
  MessageSquare,
  Bell,
  Save,
  Plus,
  Trash2,
  Hash,
  Bot,
  CheckCircle,
  AlertCircle,
  Zap,
  BarChart3,
  Link2,
  Globe,
  Crown,
  Star,
  Activity,
  TrendingUp,
  Eye,
  Filter,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface Channel {
  id: string;
  name: string;
  type: "text" | "voice" | "category";
  position: number;
}

interface InviteSettings {
  allowedChannels: string[];
  maxInvitesPerUser: number;
  cooldownMinutes: number;
  requireRole: string;
  logChannel: string;
  autoDelete: boolean;
  autoDeleteMinutes: number;
  blacklistedDomains: string[];
  whitelist: boolean;
  whitelistedDomains: string[];
}

interface ServerStats {
  totalInvites: number;
  todayInvites: number;
  blockedInvites: number;
  topChannels: { name: string; count: number }[];
}

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<
    { id: string; name: string; color: string }[]
  >([]);
  const [settings, setSettings] = useState<InviteSettings>({
    allowedChannels: [],
    maxInvitesPerUser: 5,
    cooldownMinutes: 10,
    requireRole: "",
    logChannel: "",
    autoDelete: true,
    autoDeleteMinutes: 60,
    blacklistedDomains: [],
    whitelist: false,
    whitelistedDomains: [],
  });
  const [stats, setStats] = useState<ServerStats>({
    totalInvites: 0,
    todayInvites: 0,
    blockedInvites: 0,
    topChannels: [],
  });
  const [newDomain, setNewDomain] = useState("");

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setChannels([
        { id: "1", name: "general", type: "text", position: 0 },
        { id: "2", name: "announcements", type: "text", position: 1 },
        { id: "3", name: "bot-commands", type: "text", position: 2 },
        { id: "4", name: "invite-sharing", type: "text", position: 3 },
        { id: "5", name: "memes", type: "text", position: 4 },
        { id: "6", name: "support", type: "text", position: 5 },
      ]);

      setRoles([
        { id: "1", name: "Owner", color: "#ff0000" },
        { id: "2", name: "Admin", color: "#ff6600" },
        { id: "3", name: "Moderator", color: "#00ff00" },
        { id: "4", name: "VIP", color: "#ffaa00" },
        { id: "5", name: "Member", color: "#0099ff" },
      ]);

      setStats({
        totalInvites: 2847,
        todayInvites: 47,
        blockedInvites: 234,
        topChannels: [
          { name: "general", count: 856 },
          { name: "invite-sharing", count: 634 },
          { name: "announcements", count: 423 },
          { name: "memes", count: 312 },
        ],
      });

      setSettings({
        allowedChannels: ["1", "4"],
        maxInvitesPerUser: 5,
        cooldownMinutes: 10,
        requireRole: "5",
        logChannel: "2",
        autoDelete: true,
        autoDeleteMinutes: 60,
        blacklistedDomains: ["spam.com", "malicious.net", "phishing.org"],
        whitelist: false,
        whitelistedDomains: ["discord.gg", "dcs.lol", "discord.com"],
      });

      setLoading(false);
    };

    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
  };

  const addDomain = (type: "blacklist" | "whitelist") => {
    if (!newDomain.trim()) return;

    if (type === "blacklist") {
      setSettings((prev) => ({
        ...prev,
        blacklistedDomains: [...prev.blacklistedDomains, newDomain.trim()],
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        whitelistedDomains: [...prev.whitelistedDomains, newDomain.trim()],
      }));
    }
    setNewDomain("");
  };

  const removeDomain = (domain: string, type: "blacklist" | "whitelist") => {
    if (type === "blacklist") {
      setSettings((prev) => ({
        ...prev,
        blacklistedDomains: prev.blacklistedDomains.filter((d) => d !== domain),
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        whitelistedDomains: prev.whitelistedDomains.filter((d) => d !== domain),
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center space-y-8">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-24 h-24 border-4 border-pink-400/30 border-b-pink-400 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Bot Dashboard wird geladen
            </h2>
            <p className="text-xl text-purple-200">
              Verbinde mit Discord Bot...
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Discord Bot Dashboard
                </h1>
                <p className="text-purple-200 text-lg">
                  Invite Management & Security Control
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-sm font-medium">
                      Bot Online
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                    <Activity className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-300 text-sm font-medium">
                      24/7 Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 flex items-center space-x-3 transform hover:-translate-y-1"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Speichern...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Einstellungen speichern</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="group bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Link2 className="w-7 h-7 text-white" />
              </div>
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">
                Gesamt Invites
              </p>
              <p className="text-4xl font-black text-white mb-2">
                {stats.totalInvites.toLocaleString()}
              </p>
              <p className="text-green-400 text-sm font-medium">
                +12% diese Woche
              </p>
            </div>
          </div>

          <div className="group bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-green-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">Heute</p>
              <p className="text-4xl font-black text-white mb-2">
                {stats.todayInvites}
              </p>
              <p className="text-yellow-400 text-sm font-medium">Sehr aktiv</p>
            </div>
          </div>

          <div className="group bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-red-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">Blockiert</p>
              <p className="text-4xl font-black text-white mb-2">
                {stats.blockedInvites}
              </p>
              <p className="text-red-400 text-sm font-medium">
                Sicherheit aktiv
              </p>
            </div>
          </div>

          <div className="group bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <Crown className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">Erfolgsrate</p>
              <p className="text-4xl font-black text-white mb-2">92.1%</p>
              <p className="text-purple-400 text-sm font-medium">Exzellent</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-3 border border-white/10 mb-12">
          <div className="flex flex-wrap gap-3">
            {[
              {
                id: "overview",
                label: "Übersicht",
                icon: BarChart3,
                color: "from-blue-500 to-cyan-500",
              },
              {
                id: "channels",
                label: "Kanäle",
                icon: Hash,
                color: "from-green-500 to-emerald-500",
              },
              {
                id: "settings",
                label: "Einstellungen",
                icon: Settings,
                color: "from-purple-500 to-violet-500",
              },
              {
                id: "security",
                label: "Sicherheit",
                icon: Shield,
                color: "from-red-500 to-pink-500",
              },
              {
                id: "logs",
                label: "Aktivität",
                icon: MessageSquare,
                color: "from-orange-500 to-yellow-500",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:-translate-y-1 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl scale-105`
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Channels */}
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
                <h3 className="text-3xl font-black text-white mb-8 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <span>Top Kanäle</span>
                </h3>

                <div className="space-y-6">
                  {stats.topChannels.map((channel, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                            index === 0
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                              : index === 1
                              ? "bg-gradient-to-r from-gray-400 to-gray-500"
                              : index === 2
                              ? "bg-gradient-to-r from-orange-400 to-red-500"
                              : "bg-gradient-to-r from-blue-400 to-purple-500"
                          }`}
                        >
                          #{index + 1}
                        </div>
                        <div>
                          <p className="text-white font-bold">
                            #{channel.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {channel.count} Invites
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{
                              width: `${
                                (channel.count / stats.topChannels[0].count) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
                <h3 className="text-3xl font-black text-white mb-8 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span>Live Aktivität</span>
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      time: "2 Min",
                      user: "MaxGamer#1234",
                      action: "Invite geteilt",
                      channel: "general",
                      status: "success",
                    },
                    {
                      time: "5 Min",
                      user: "CoolUser#5678",
                      action: "Invite blockiert",
                      channel: "general",
                      status: "blocked",
                    },
                    {
                      time: "8 Min",
                      user: "ProPlayer#9999",
                      action: "Invite geteilt",
                      channel: "invite-sharing",
                      status: "success",
                    },
                    {
                      time: "12 Min",
                      user: "NewMember#1111",
                      action: "Spam erkannt",
                      channel: "general",
                      status: "blocked",
                    },
                    {
                      time: "15 Min",
                      user: "VIPUser#7777",
                      action: "Invite geteilt",
                      channel: "announcements",
                      status: "success",
                    },
                  ].map((log, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            log.status === "success"
                              ? "bg-green-400 animate-pulse"
                              : "bg-red-400 animate-pulse"
                          }`}
                        ></div>
                        <div>
                          <p className="text-white font-medium">{log.user}</p>
                          <p className="text-gray-400 text-sm">
                            {log.action} in #{log.channel}
                          </p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "channels" && (
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
              <h3 className="text-3xl font-black text-white mb-8 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <span>Kanal Management</span>
              </h3>

              <p className="text-gray-300 mb-8 text-lg">
                Wähle die Kanäle aus, in denen Nutzer Discord Invite-Links
                teilen dürfen.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {channels
                  .filter((c) => c.type === "text")
                  .map((channel) => (
                    <div
                      key={channel.id}
                      className={`group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 ${
                        settings.allowedChannels.includes(channel.id)
                          ? "border-green-500 bg-green-500/20 shadow-2xl shadow-green-500/20"
                          : "border-gray-600 bg-white/5 hover:border-gray-500 hover:bg-white/10"
                      }`}
                      onClick={() => {
                        setSettings((prev) => ({
                          ...prev,
                          allowedChannels: prev.allowedChannels.includes(
                            channel.id
                          )
                            ? prev.allowedChannels.filter(
                                (id) => id !== channel.id
                              )
                            : [...prev.allowedChannels, channel.id],
                        }));
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              settings.allowedChannels.includes(channel.id)
                                ? "bg-green-500"
                                : "bg-gray-600 group-hover:bg-gray-500"
                            } transition-colors duration-300`}
                          >
                            <Hash className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white font-bold text-lg">
                            {channel.name}
                          </span>
                        </div>
                        {settings.allowedChannels.includes(channel.id) && (
                          <CheckCircle className="w-6 h-6 text-green-400 animate-pulse" />
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {settings.allowedChannels.includes(channel.id)
                          ? "Invites erlaubt"
                          : "Invites gesperrt"}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Settings */}
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
                <h3 className="text-3xl font-black text-white mb-8 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <span>Bot Einstellungen</span>
                </h3>

                <div className="space-y-8">
                  <div>
                    <label className="block text-white font-bold mb-3 text-lg">
                      Max. Invites pro Nutzer
                    </label>
                    <input
                      type="number"
                      value={settings.maxInvitesPerUser}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          maxInvitesPerUser: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg focus:border-purple-500 focus:outline-none transition-all duration-300"
                      min="1"
                      max="50"
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      Wie viele Invites ein Nutzer pro Tag teilen darf
                    </p>
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-3 text-lg">
                      Cooldown (Minuten)
                    </label>
                    <input
                      type="number"
                      value={settings.cooldownMinutes}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          cooldownMinutes: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg focus:border-purple-500 focus:outline-none transition-all duration-300"
                      min="0"
                      max="1440"
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      Wartezeit zwischen Invite-Shares
                    </p>
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-3 text-lg">
                      Erforderliche Rolle
                    </label>
                    <select
                      value={settings.requireRole}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          requireRole: e.target.value,
                        }))
                      }
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg focus:border-purple-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">Keine Rolle erforderlich</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-gray-400 text-sm mt-2">
                      Mindestrolle zum Teilen von Invites
                    </p>
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-3 text-lg">
                      Log Kanal
                    </label>
                    <select
                      value={settings.logChannel}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          logChannel: e.target.value,
                        }))
                      }
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg focus:border-purple-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">Kein Log Kanal</option>
                      {channels
                        .filter((c) => c.type === "text")
                        .map((channel) => (
                          <option key={channel.id} value={channel.id}>
                            #{channel.name}
                          </option>
                        ))}
                    </select>
                    <p className="text-gray-400 text-sm mt-2">
                      Kanal für Bot-Aktivitäten und Logs
                    </p>
                  </div>
                </div>
              </div>

              {/* Auto Delete Settings */}
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
                <h3 className="text-3xl font-black text-white mb-8 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                  <span>Auto-Delete</span>
                </h3>

                <div className="space-y-8">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-white font-bold text-lg">
                          Auto-Delete aktivieren
                        </h4>
                        <p className="text-gray-400">
                          Invites automatisch nach Zeit löschen
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            autoDelete: !prev.autoDelete,
                          }))
                        }
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                          settings.autoDelete
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                            settings.autoDelete
                              ? "translate-x-7"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {settings.autoDelete && (
                    <div>
                      <label className="block text-white font-bold mb-3 text-lg">
                        Löschzeit (Minuten)
                      </label>
                      <input
                        type="number"
                        value={settings.autoDeleteMinutes}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            autoDeleteMinutes: parseInt(e.target.value),
                          }))
                        }
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg focus:border-red-500 focus:outline-none transition-all duration-300"
                        min="1"
                        max="10080"
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Invites werden nach {settings.autoDeleteMinutes} Minuten
                        automatisch gelöscht
                      </p>
                    </div>
                  )}

                  <div className="p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <Bell className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-yellow-400 font-bold">Hinweis</h4>
                    </div>
                    <p className="text-yellow-200 text-sm">
                      Auto-Delete hilft dabei, den Server sauber zu halten und
                      verhindert Spam durch alte Invite-Links.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
              <h3 className="text-3xl font-black text-white mb-8 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span>Sicherheits-Filter</span>
              </h3>

              {/* Whitelist Toggle */}
              <div className="mb-12 p-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-xl mb-2">
                      Whitelist-Modus
                    </h4>
                    <p className="text-blue-200">
                      Nur explizit erlaubte Domains zulassen (empfohlen für
                      maximale Sicherheit)
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        whitelist: !prev.whitelist,
                      }))
                    }
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                      settings.whitelist
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                        settings.whitelist ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Blacklist */}
                <div>
                  <h4 className="text-white font-bold text-xl mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <span>Blockierte Domains</span>
                  </h4>

                  <div className="space-y-4 mb-6">
                    {settings.blacklistedDomains.map((domain, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-red-500/20 border border-red-500/30 rounded-2xl hover:bg-red-500/30 transition-all duration-300"
                      >
                        <span className="text-white font-medium">{domain}</span>
                        <button
                          onClick={() => removeDomain(domain, "blacklist")}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      placeholder="z.B. spam.com"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:border-red-500 focus:outline-none transition-all duration-300"
                      onKeyPress={(e) =>
                        e.key === "Enter" && addDomain("blacklist")
                      }
                    />
                    <button
                      onClick={() => addDomain("blacklist")}
                      className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Whitelist */}
                <div>
                  <h4 className="text-white font-bold text-xl mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span>Erlaubte Domains</span>
                  </h4>

                  <div className="space-y-4 mb-6">
                    {settings.whitelistedDomains.map((domain, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-green-500/20 border border-green-500/30 rounded-2xl hover:bg-green-500/30 transition-all duration-300"
                      >
                        <span className="text-white font-medium">{domain}</span>
                        <button
                          onClick={() => removeDomain(domain, "whitelist")}
                          className="text-green-400 hover:text-green-300 transition-colors p-2 hover:bg-green-500/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      placeholder="z.B. discord.gg"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:border-green-500 focus:outline-none transition-all duration-300"
                      onKeyPress={(e) =>
                        e.key === "Enter" && addDomain("whitelist")
                      }
                    />
                    <button
                      onClick={() => addDomain("whitelist")}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
              <h3 className="text-3xl font-black text-white mb-8 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span>Bot Aktivitäts-Logs</span>
              </h3>

              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-300 text-lg">
                  Live-Überwachung aller Bot-Aktivitäten
                </p>
                <div className="flex items-center space-x-3">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white">
                    <option>Alle Aktivitäten</option>
                    <option>Nur Erfolgreiche</option>
                    <option>Nur Blockierte</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    time: "14:32:15",
                    user: "MaxGamer#1234",
                    action: "Invite erfolgreich geteilt",
                    channel: "general",
                    status: "success",
                    details: "discord.gg/example",
                  },
                  {
                    time: "14:28:42",
                    user: "CoolUser#5678",
                    action: "Invite blockiert (Spam-Domain)",
                    channel: "general",
                    status: "blocked",
                    details: "malicious.net/fake",
                  },
                  {
                    time: "14:25:18",
                    user: "ProPlayer#9999",
                    action: "Invite erfolgreich geteilt",
                    channel: "invite-sharing",
                    status: "success",
                    details: "dcs.lol/gaming",
                  },
                  {
                    time: "14:20:33",
                    user: "NewMember#1111",
                    action: "Invite blockiert (Cooldown)",
                    channel: "general",
                    status: "blocked",
                    details: "Zu schnell gepostet",
                  },
                  {
                    time: "14:15:07",
                    user: "VIPUser#7777",
                    action: "Invite erfolgreich geteilt",
                    channel: "announcements",
                    status: "success",
                    details: "discord.gg/vip-server",
                  },
                  {
                    time: "14:12:44",
                    user: "SpamBot#0000",
                    action: "Invite blockiert (Blacklist)",
                    channel: "general",
                    status: "blocked",
                    details: "spam.com/virus",
                  },
                ].map((log, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                      log.status === "success"
                        ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                        : "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            log.status === "success"
                              ? "bg-green-400 animate-pulse"
                              : "bg-red-400 animate-pulse"
                          }`}
                        ></div>
                        <div>
                          <p className="text-white font-bold text-lg">
                            {log.user}
                          </p>
                          <p className="text-gray-400">
                            {log.action} in #{log.channel}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 text-sm">
                          {log.time}
                        </span>
                        <div
                          className={`inline-block ml-3 px-3 py-1 rounded-full text-xs font-bold ${
                            log.status === "success"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {log.status === "success" ? "ERFOLG" : "BLOCKIERT"}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm bg-white/5 p-3 rounded-xl">
                      <strong>Details:</strong> {log.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
