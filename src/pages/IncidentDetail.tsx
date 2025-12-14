import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Clock,
  Users,
  AlertTriangle,
  Target,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockIncidents, mockAlerts } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const incident = mockIncidents.find((i) => i.id === id);

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Incident not found</h2>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/incidents")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Incidents
        </Button>
      </div>
    );
  }

  const relatedAlerts = mockAlerts.slice(0, incident.alertCount);

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "severity-critical";
      case "High":
        return "severity-high";
      case "Medium":
        return "severity-medium";
      case "Low":
        return "severity-low";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/incidents")}
            className="shrink-0 mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-primary text-lg">{incident.id}</span>
              {getStatusBadge(incident.status)}
              <Badge
                variant="outline"
                className={cn("text-xs", getSeverityClass(incident.severity))}
              >
                {incident.severity}
              </Badge>
            </div>
            <h1 className="text-xl font-bold">{incident.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(incident.createdAt).toLocaleString()}
              </span>
              {incident.assignee && (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {incident.assignee}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Note
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Push to JIRA
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline / Related Alerts */}
          <div className="cyber-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h2 className="font-semibold">Related Alerts ({incident.alertCount})</h2>
            </div>

            <div className="space-y-4">
              {relatedAlerts.map((alert, index) => (
                <div
                  key={alert.AlertID}
                  className="relative pl-6 pb-4 last:pb-0"
                >
                  {/* Timeline line */}
                  {index < relatedAlerts.length - 1 && (
                    <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-border" />
                  )}
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute left-0 top-1.5 w-4 h-4 rounded-full border-2",
                      alert.Input.AlertSeverity === "Critical"
                        ? "bg-destructive border-destructive"
                        : alert.Input.AlertSeverity === "High"
                        ? "bg-warning border-warning"
                        : "bg-primary border-primary"
                    )}
                  />

                  <div
                    className="cyber-card p-4 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => navigate(`/alerts/${alert.AlertID}`)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-primary">
                            #{alert.AlertID.toString().padStart(4, "0")}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              getSeverityClass(alert.Input.AlertSeverity)
                            )}
                          >
                            {alert.Input.AlertSeverity}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm">{alert.Input.AlertName}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.Input.Timestamp).toLocaleString()}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analyst Notes */}
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Analyst Notes</h2>
              <Button variant="outline" size="sm">
                Add Note
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">SOC Analyst</span>
                  <span className="text-xs text-muted-foreground">• 2 hours ago</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Initial triage complete. Attack appears to originate from known threat actor
                  infrastructure. Escalating to Tier 2 for further analysis.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* MITRE Mapping */}
          <div className="cyber-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">MITRE ATT&CK</h2>
            </div>

            <div className="space-y-2">
              {incident.mitreAttacks.map((attack) => (
                <div
                  key={attack}
                  className="flex items-center justify-between p-2 bg-secondary/50 rounded"
                >
                  <span className="font-mono text-sm text-primary">{attack}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="cyber-card p-6">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Mark as Resolved
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Assign to Analyst
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="cyber-card p-6">
            <h2 className="font-semibold mb-4">Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{new Date(incident.updatedAt).toLocaleDateString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alert Count</span>
                <span>{incident.alertCount}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assignee</span>
                <span>{incident.assignee?.split("@")[0] || "Unassigned"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
