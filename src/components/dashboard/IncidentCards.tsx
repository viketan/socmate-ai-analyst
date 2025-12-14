import { useNavigate } from "react-router-dom";
import { Shield, Clock, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockIncidents } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function IncidentCards() {
  const navigate = useNavigate();

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "border-l-destructive";
      case "High":
        return "border-l-warning";
      case "Medium":
        return "border-l-info";
      case "Low":
        return "border-l-success";
      default:
        return "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge className="bg-destructive/20 text-destructive border-0">Open</Badge>;
      case "Triaged":
        return <Badge className="bg-warning/20 text-warning border-0">Triaged</Badge>;
      case "Resolved":
        return <Badge className="bg-success/20 text-success border-0">Resolved</Badge>;
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

  const openIncidents = mockIncidents.filter((i) => i.status !== "Resolved");
  const resolvedIncidents = mockIncidents.filter((i) => i.status === "Resolved");

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Incidents</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            {openIncidents.length} Open
          </Badge>
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            {resolvedIncidents.length} Resolved
          </Badge>
        </div>
      </div>

      <div className="divide-y divide-border">
        {mockIncidents.slice(0, 4).map((incident) => (
          <div
            key={incident.id}
            className={cn(
              "p-4 hover:bg-primary/5 transition-colors cursor-pointer border-l-4",
              getSeverityClass(incident.severity)
            )}
            onClick={() => navigate(`/incidents/${incident.id}`)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-primary">{incident.id}</span>
                  {getStatusBadge(incident.status)}
                </div>
                <h3 className="font-medium text-sm line-clamp-1">{incident.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(incident.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {incident.alertCount} alerts
                  </span>
                  {incident.assignee && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Assigned
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {incident.mitreAttacks.slice(0, 3).map((attack) => (
                    <span
                      key={attack}
                      className="px-1.5 py-0.5 text-[10px] font-mono bg-primary/10 text-primary rounded"
                    >
                      {attack}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full text-primary"
          onClick={() => navigate("/incidents")}
        >
          View All Incidents
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
