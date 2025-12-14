import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  Shield,
  Globe,
  Server,
  Target,
  Lightbulb,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockAlerts } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AlertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const alert = mockAlerts.find((a) => a.AlertID.toString() === id);

  if (!alert) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Alert not found</h2>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/alerts")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Alerts
        </Button>
      </div>
    );
  }

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

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(alert, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/alerts")}
            className="shrink-0 mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-primary">
                #{alert.AlertID.toString().padStart(4, "0")}
              </span>
              <Badge
                variant="outline"
                className={cn("text-xs", getSeverityClass(alert.Input.AlertSeverity))}
              >
                {alert.Input.AlertSeverity}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  alert.Status === "Open"
                    ? "status-open"
                    : alert.Status === "Triaged"
                    ? "status-triaged"
                    : "status-resolved"
                )}
              >
                {alert.Status}
              </Badge>
            </div>
            <h1 className="text-xl font-bold">{alert.Input.AlertName}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(alert.Input.Timestamp).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Server className="h-4 w-4" />
                {alert.Input.ProviderName}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 mr-2 text-success" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? "Copied" : "Copy JSON"}
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
          {/* Agent Analysis */}
          <div className="cyber-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-warning" />
              <h2 className="font-semibold">AI Analysis</h2>
              <Badge variant="outline" className="ml-auto bg-success/10 text-success border-success/30">
                {alert.AgentOutput.ConfidenceLevel} Confidence
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Incident Summary
                </h3>
                <p className="text-sm">{alert.AgentOutput.IncidentSummary}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Reasoning
                </h3>
                <p className="text-sm text-muted-foreground">
                  {alert.AgentOutput.Reasoning}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Suggested Remediation
                </h3>
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm">{alert.AgentOutput.SuggestedRemediation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* MITRE Mapping */}
          <div className="cyber-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">MITRE ATT&CK Mapping</h2>
            </div>

            <div className="space-y-2">
              {alert.MITREMapping.TacticsTechniques.map((technique, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <span className="text-sm">{technique}</span>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Enrichment Data */}
          {alert.Enrichment.length > 0 && (
            <div className="cyber-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-info" />
                <h2 className="font-semibold">Enrichment Data</h2>
              </div>

              <div className="space-y-4">
                {alert.Enrichment.map((enrichment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{enrichment.Type}</Badge>
                      <code className="text-sm font-mono text-primary">
                        {enrichment.Indicator}
                      </code>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div className="p-2 bg-secondary/50 rounded">
                        <span className="text-muted-foreground">GeoIP:</span>{" "}
                        {enrichment.GeoIP}
                      </div>
                      <div className="p-2 bg-secondary/50 rounded">
                        <span className="text-muted-foreground">WHOIS:</span>{" "}
                        {enrichment.WHOIS}
                      </div>
                      <div className="p-2 bg-secondary/50 rounded">
                        <span className="text-muted-foreground">Shodan:</span>{" "}
                        {enrichment.Shodan}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Entities */}
          <div className="cyber-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-success" />
              <h2 className="font-semibold">Affected Entities</h2>
            </div>

            <div className="space-y-3">
              {alert.Input.Entities.map((entity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-secondary/50 rounded"
                >
                  <Badge variant="outline" className="text-xs">
                    {entity.Type}
                  </Badge>
                  <code className="text-xs font-mono text-primary truncate ml-2">
                    {entity.Value}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Extended Properties */}
          <div className="cyber-card p-6">
            <h2 className="font-semibold mb-4">Extended Properties</h2>
            <div className="space-y-2 text-sm">
              {Object.entries(alert.Input.ExtendedProperties).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Correlation */}
          <div className="cyber-card p-6">
            <h2 className="font-semibold mb-4">Correlation</h2>
            <p className="text-sm text-muted-foreground mb-3">
              {alert.Correlation.Notes}
            </p>
            {alert.Correlation.RelatedAlerts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {alert.Correlation.RelatedAlerts.map((relatedId) => (
                  <Button
                    key={relatedId}
                    variant="outline"
                    size="sm"
                    className="font-mono text-primary"
                    onClick={() => navigate(`/alerts/${relatedId}`)}
                  >
                    #{relatedId.toString().padStart(4, "0")}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
