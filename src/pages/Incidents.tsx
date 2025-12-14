import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Search,
  Filter,
  ChevronRight,
  Clock,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockIncidents } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Incidents() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredIncidents = mockIncidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "border-l-destructive bg-destructive/5";
      case "High":
        return "border-l-warning bg-warning/5";
      case "Medium":
        return "border-l-info bg-info/5";
      case "Low":
        return "border-l-success bg-success/5";
      default:
        return "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return (
          <Badge className="bg-destructive/20 text-destructive border-0">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Open
          </Badge>
        );
      case "Triaged":
        return (
          <Badge className="bg-warning/20 text-warning border-0">
            <Clock className="h-3 w-3 mr-1" />
            Triaged
          </Badge>
        );
      case "Resolved":
        return (
          <Badge className="bg-success/20 text-success border-0">
            <Shield className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = {
    total: mockIncidents.length,
    open: mockIncidents.filter((i) => i.status === "Open").length,
    triaged: mockIncidents.filter((i) => i.status === "Triaged").length,
    resolved: mockIncidents.filter((i) => i.status === "Resolved").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Incidents
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track and manage security incidents
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter("all")}
          className={cn(
            "cyber-card p-4 text-left transition-colors",
            statusFilter === "all" && "border-primary"
          )}
        >
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </button>
        <button
          onClick={() => setStatusFilter("Open")}
          className={cn(
            "cyber-card p-4 text-left transition-colors",
            statusFilter === "Open" && "border-destructive"
          )}
        >
          <p className="text-2xl font-bold text-destructive">{stats.open}</p>
          <p className="text-sm text-muted-foreground">Open</p>
        </button>
        <button
          onClick={() => setStatusFilter("Triaged")}
          className={cn(
            "cyber-card p-4 text-left transition-colors",
            statusFilter === "Triaged" && "border-warning"
          )}
        >
          <p className="text-2xl font-bold text-warning">{stats.triaged}</p>
          <p className="text-sm text-muted-foreground">Triaged</p>
        </button>
        <button
          onClick={() => setStatusFilter("Resolved")}
          className={cn(
            "cyber-card p-4 text-left transition-colors",
            statusFilter === "Resolved" && "border-success"
          )}
        >
          <p className="text-2xl font-bold text-success">{stats.resolved}</p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </button>
      </div>

      {/* Search */}
      <div className="cyber-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="shrink-0">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <div
            key={incident.id}
            className={cn(
              "cyber-card p-6 border-l-4 hover:bg-primary/5 transition-colors cursor-pointer",
              getSeverityClass(incident.severity)
            )}
            onClick={() => navigate(`/incidents/${incident.id}`)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-primary font-medium">
                    {incident.id}
                  </span>
                  {getStatusBadge(incident.status)}
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      incident.severity === "Critical"
                        ? "severity-critical"
                        : incident.severity === "High"
                        ? "severity-high"
                        : incident.severity === "Medium"
                        ? "severity-medium"
                        : "severity-low"
                    )}
                  >
                    {incident.severity}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold mb-2">{incident.title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Created: {formatDate(incident.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {incident.alertCount} alerts
                  </span>
                  {incident.assignee && (
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {incident.assignee.split("@")[0]}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {incident.mitreAttacks.map((attack) => (
                    <span
                      key={attack}
                      className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary rounded"
                    >
                      {attack}
                    </span>
                  ))}
                </div>
              </div>

              <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />
            </div>
          </div>
        ))}

        {filteredIncidents.length === 0 && (
          <div className="cyber-card p-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No incidents found</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No incidents to display"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
