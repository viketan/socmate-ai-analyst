import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ChevronRight, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockAlerts } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function AlertsTable() {
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

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

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Open":
        return "status-open";
      case "Triaged":
        return "status-triaged";
      case "Resolved":
        return "status-resolved";
      default:
        return "";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h2 className="font-semibold">Recent Alerts</h2>
          <Badge variant="secondary" className="ml-2">
            {mockAlerts.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/alerts")}
          className="text-primary"
        >
          View All
          <ExternalLink className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-24">Alert ID</TableHead>
              <TableHead>Alert Name</TableHead>
              <TableHead className="w-24">Severity</TableHead>
              <TableHead className="w-32">Source</TableHead>
              <TableHead className="w-28">Time</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAlerts.slice(0, 5).map((alert) => (
              <TableRow
                key={alert.AlertID}
                className={cn(
                  "cursor-pointer transition-colors border-border",
                  alert.Input.AlertSeverity === "Critical" && "bg-destructive/5",
                  hoveredRow === alert.AlertID && "bg-primary/5"
                )}
                onMouseEnter={() => setHoveredRow(alert.AlertID)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => navigate(`/alerts/${alert.AlertID}`)}
              >
                <TableCell className="font-mono text-sm text-primary">
                  #{alert.AlertID.toString().padStart(4, "0")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium line-clamp-1">
                      {alert.Input.AlertName}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {alert.Input.MITREAttackTechniques.map((t) => (
                        <span key={t} className="text-primary/70">{t}</span>
                      ))}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getSeverityClass(alert.Input.AlertSeverity))}
                  >
                    {alert.Input.AlertSeverity}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {alert.Input.ProviderName.replace("Microsoft ", "").replace("Azure ", "")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(alert.Input.Timestamp)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getStatusClass(alert.Status))}
                  >
                    {alert.Status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
