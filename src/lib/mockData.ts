export interface Alert {
  AlertID: number;
  Input: {
    AlertName: string;
    AlertSeverity: "Critical" | "High" | "Medium" | "Low";
    Timestamp: string;
    Entities: Array<{ Type: string; Value: string }>;
    ProviderName: string;
    MITREAttackTechniques: string[];
    ExtendedProperties: Record<string, any>;
  };
  Enrichment: Array<{
    Indicator: string;
    Type: string;
    GeoIP: string;
    WHOIS: string;
    Shodan: string;
  }>;
  MITREMapping: {
    TacticsTechniques: string[];
  };
  Correlation: {
    RelatedAlerts: number[];
    Notes: string;
  };
  AgentOutput: {
    IncidentSummary: string;
    Reasoning: string;
    ConfidenceLevel: string;
    MITREMapping: string[];
    AffectedEntities: string[];
    SuggestedRemediation: string;
  };
  Status: "Open" | "Triaged" | "Resolved";
}

export const mockAlerts: Alert[] = [
  {
    AlertID: 1,
    Input: {
      AlertName: "Brute Force Successful - Account Compromised",
      AlertSeverity: "Critical",
      Timestamp: "2025-02-26T16:31:14Z",
      Entities: [
        { Type: "Account", Value: "john.doe@contoso.com" },
        { Type: "IP", Value: "203.0.113.45" }
      ],
      ProviderName: "Azure AD Identity Protection",
      MITREAttackTechniques: ["T1110"],
      ExtendedProperties: {
        AuthenticationProtocol: "AzureAD Password",
        FailedAttempts: 10,
        SourceCountry: "Russia"
      }
    },
    Enrichment: [{
      Indicator: "203.0.113.45",
      Type: "IP",
      GeoIP: "RU",
      WHOIS: "Org: RU Hosting ISP, RegDate: 2025-06-10",
      Shodan: "Ports 22,3389 open; SSH and RDP services detected"
    }],
    MITREMapping: {
      TacticsTechniques: [
        "Credential Access: Brute Force (T1110)",
        "Initial Access: Valid Accounts (T1078)"
      ]
    },
    Correlation: {
      RelatedAlerts: [3, 13, 14],
      Notes: "Brute force alert is part of a sequence that includes password spray attempts before it."
    },
    AgentOutput: {
      IncidentSummary: "External brute force attack succeeded in compromising user john.doe@contoso.com.",
      Reasoning: "Multiple failed login attempts were observed from IP 203.0.113.45, followed by a successful login.",
      ConfidenceLevel: "High",
      MITREMapping: ["Credential Access: Brute Force (T1110)", "Initial Access: Valid Accounts (T1078)"],
      AffectedEntities: ["Account: john.doe@contoso.com"],
      SuggestedRemediation: "Reset the compromised account's password and block the source IP."
    },
    Status: "Open"
  },
  {
    AlertID: 2,
    Input: {
      AlertName: "Suspicious PowerShell Execution",
      AlertSeverity: "High",
      Timestamp: "2025-02-26T14:22:33Z",
      Entities: [
        { Type: "Host", Value: "WORKSTATION-PC01" },
        { Type: "Account", Value: "admin@contoso.com" }
      ],
      ProviderName: "Microsoft Defender for Endpoint",
      MITREAttackTechniques: ["T1059.001"],
      ExtendedProperties: {
        CommandLine: "powershell -enc SQBuAHYAbwBrAGUALQBXAGUA...",
        ParentProcess: "cmd.exe"
      }
    },
    Enrichment: [],
    MITREMapping: {
      TacticsTechniques: ["Execution: PowerShell (T1059.001)"]
    },
    Correlation: {
      RelatedAlerts: [1],
      Notes: "PowerShell execution detected after account compromise."
    },
    AgentOutput: {
      IncidentSummary: "Encoded PowerShell command executed on compromised workstation.",
      Reasoning: "Base64 encoded PowerShell detected, commonly used by attackers to evade detection.",
      ConfidenceLevel: "High",
      MITREMapping: ["Execution: PowerShell (T1059.001)"],
      AffectedEntities: ["Host: WORKSTATION-PC01"],
      SuggestedRemediation: "Isolate the workstation and perform forensic analysis."
    },
    Status: "Triaged"
  },
  {
    AlertID: 3,
    Input: {
      AlertName: "Password Spray Attack Detected",
      AlertSeverity: "High",
      Timestamp: "2025-02-26T15:45:00Z",
      Entities: [
        { Type: "IP", Value: "198.51.100.22" }
      ],
      ProviderName: "Azure AD Identity Protection",
      MITREAttackTechniques: ["T1110.003"],
      ExtendedProperties: {
        TargetedAccounts: 150,
        SuccessfulAttempts: 0
      }
    },
    Enrichment: [{
      Indicator: "198.51.100.22",
      Type: "IP",
      GeoIP: "CN",
      WHOIS: "Org: China Telecom",
      Shodan: "Open ports: 80, 443"
    }],
    MITREMapping: {
      TacticsTechniques: ["Credential Access: Password Spraying (T1110.003)"]
    },
    Correlation: {
      RelatedAlerts: [1],
      Notes: "Password spray preceded the successful brute force attack."
    },
    AgentOutput: {
      IncidentSummary: "Large-scale password spray attack targeting 150 accounts.",
      Reasoning: "Attack pattern consistent with automated credential stuffing tools.",
      ConfidenceLevel: "Medium",
      MITREMapping: ["Credential Access: Password Spraying (T1110.003)"],
      AffectedEntities: ["150 accounts targeted"],
      SuggestedRemediation: "Block source IP and enforce MFA for all users."
    },
    Status: "Resolved"
  },
  {
    AlertID: 4,
    Input: {
      AlertName: "Malware Detection - Emotet",
      AlertSeverity: "Critical",
      Timestamp: "2025-02-26T12:10:45Z",
      Entities: [
        { Type: "Host", Value: "SERVER-DB01" },
        { Type: "File", Value: "C:\\Temp\\invoice.doc" }
      ],
      ProviderName: "Microsoft Defender for Endpoint",
      MITREAttackTechniques: ["T1566.001"],
      ExtendedProperties: {
        MalwareFamily: "Emotet",
        HashSHA256: "a1b2c3d4e5f6..."
      }
    },
    Enrichment: [],
    MITREMapping: {
      TacticsTechniques: ["Initial Access: Phishing Attachment (T1566.001)"]
    },
    Correlation: {
      RelatedAlerts: [],
      Notes: "Standalone malware detection."
    },
    AgentOutput: {
      IncidentSummary: "Emotet malware detected on database server.",
      Reasoning: "Known Emotet variant identified via signature match.",
      ConfidenceLevel: "High",
      MITREMapping: ["Initial Access: Phishing Attachment (T1566.001)"],
      AffectedEntities: ["Host: SERVER-DB01"],
      SuggestedRemediation: "Quarantine file, scan system, and check for lateral movement."
    },
    Status: "Open"
  },
  {
    AlertID: 5,
    Input: {
      AlertName: "Data Exfiltration Attempt",
      AlertSeverity: "Critical",
      Timestamp: "2025-02-26T18:55:12Z",
      Entities: [
        { Type: "Host", Value: "FILESERVER-01" },
        { Type: "Account", Value: "service.account@contoso.com" }
      ],
      ProviderName: "Microsoft Cloud App Security",
      MITREAttackTechniques: ["T1048"],
      ExtendedProperties: {
        DataVolume: "2.5GB",
        DestinationIP: "45.33.32.156"
      }
    },
    Enrichment: [{
      Indicator: "45.33.32.156",
      Type: "IP",
      GeoIP: "US",
      WHOIS: "Org: DigitalOcean",
      Shodan: "HTTP server, possible C2"
    }],
    MITREMapping: {
      TacticsTechniques: ["Exfiltration: Exfiltration Over Alternative Protocol (T1048)"]
    },
    Correlation: {
      RelatedAlerts: [1, 2],
      Notes: "Data exfiltration appears to be the goal of the attack chain."
    },
    AgentOutput: {
      IncidentSummary: "Large data transfer to external IP detected from file server.",
      Reasoning: "2.5GB transfer to known cloud hosting provider suggests data theft.",
      ConfidenceLevel: "High",
      MITREMapping: ["Exfiltration: Exfiltration Over Alternative Protocol (T1048)"],
      AffectedEntities: ["Host: FILESERVER-01", "Account: service.account@contoso.com"],
      SuggestedRemediation: "Block destination IP, revoke service account, and assess data loss."
    },
    Status: "Open"
  },
  {
    AlertID: 6,
    Input: {
      AlertName: "Unusual Sign-in Location",
      AlertSeverity: "Medium",
      Timestamp: "2025-02-26T09:15:30Z",
      Entities: [
        { Type: "Account", Value: "jane.smith@contoso.com" },
        { Type: "IP", Value: "103.224.182.50" }
      ],
      ProviderName: "Azure AD Identity Protection",
      MITREAttackTechniques: ["T1078"],
      ExtendedProperties: {
        Location: "Vietnam",
        Device: "Unknown"
      }
    },
    Enrichment: [],
    MITREMapping: {
      TacticsTechniques: ["Initial Access: Valid Accounts (T1078)"]
    },
    Correlation: {
      RelatedAlerts: [],
      Notes: "User typically signs in from US."
    },
    AgentOutput: {
      IncidentSummary: "User signed in from unusual location (Vietnam).",
      Reasoning: "Geographic anomaly detected; user has no travel history.",
      ConfidenceLevel: "Medium",
      MITREMapping: ["Initial Access: Valid Accounts (T1078)"],
      AffectedEntities: ["Account: jane.smith@contoso.com"],
      SuggestedRemediation: "Verify with user and consider session revocation."
    },
    Status: "Triaged"
  }
];

export const kpiData = {
  totalAlerts: 156,
  escalatedAlerts: 8,
  suppressedAlerts: 23,
  mttr: "2.4h",
  alertsTrend: [
    { hour: "00:00", count: 5 },
    { hour: "04:00", count: 3 },
    { hour: "08:00", count: 12 },
    { hour: "12:00", count: 18 },
    { hour: "16:00", count: 25 },
    { hour: "20:00", count: 8 }
  ]
};

export const mitreDistribution = [
  { name: "Initial Access", value: 35, techniques: ["T1566", "T1078"] },
  { name: "Credential Access", value: 28, techniques: ["T1110"] },
  { name: "Execution", value: 18, techniques: ["T1059"] },
  { name: "Exfiltration", value: 12, techniques: ["T1048"] },
  { name: "Persistence", value: 7, techniques: ["T1053"] }
];
