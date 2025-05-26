import { zones, alerts, feedbackReports, solutions, type Zone, type Alert, type FeedbackReport, type Solution, type InsertZone, type InsertAlert, type InsertFeedbackReport, type InsertSolution } from "@shared/schema";

export interface IStorage {
  // Zones
  getZones(): Promise<Zone[]>;
  getZone(id: string): Promise<Zone | undefined>;
  updateZone(id: string, zone: Partial<InsertZone>): Promise<Zone | undefined>;
  
  // Alerts
  getAlerts(): Promise<Alert[]>;
  getAlertsByZone(zoneId: string): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: number): Promise<Alert | undefined>;
  
  // Feedback Reports
  createFeedbackReport(report: InsertFeedbackReport): Promise<FeedbackReport>;
  getFeedbackReports(): Promise<FeedbackReport[]>;
  updateFeedbackReportStatus(id: number, status: string): Promise<FeedbackReport | undefined>;
  
  // Solutions
  createSolution(solution: InsertSolution): Promise<Solution>;
  getSolutionByReportId(reportId: number): Promise<Solution | undefined>;
}

export class MemStorage implements IStorage {
  private zones: Map<string, Zone>;
  private alerts: Map<number, Alert>;
  private feedbackReports: Map<number, FeedbackReport>;
  private solutions: Map<number, Solution>;
  private currentAlertId: number;
  private currentReportId: number;
  private currentSolutionId: number;

  constructor() {
    this.zones = new Map();
    this.alerts = new Map();
    this.feedbackReports = new Map();
    this.solutions = new Map();
    this.currentAlertId = 1;
    this.currentReportId = 1;
    this.currentSolutionId = 1;
    
    this.initializeZones();
    this.initializeAlerts();
  }

  private initializeZones() {
    const zoneData: Zone[] = [
      { id: "A1", name: "Zone A1", status: "healthy", soilMoisture: 75, temperature: 22, humidity: 65, lastUpdated: new Date() },
      { id: "A2", name: "Zone A2", status: "warning", soilMoisture: 45, temperature: 25, humidity: 55, lastUpdated: new Date() },
      { id: "A3", name: "Zone A3", status: "critical", soilMoisture: 15, temperature: 28, humidity: 40, lastUpdated: new Date() },
      { id: "A4", name: "Zone A4", status: "healthy", soilMoisture: 80, temperature: 21, humidity: 70, lastUpdated: new Date() },
      { id: "B1", name: "Zone B1", status: "healthy", soilMoisture: 70, temperature: 23, humidity: 68, lastUpdated: new Date() },
      { id: "B2", name: "Zone B2", status: "warning", soilMoisture: 35, temperature: 26, humidity: 50, lastUpdated: new Date() },
      { id: "B3", name: "Zone B3", status: "healthy", soilMoisture: 85, temperature: 20, humidity: 75, lastUpdated: new Date() },
      { id: "B4", name: "Zone B4", status: "warning", soilMoisture: 55, temperature: 24, humidity: 60, lastUpdated: new Date() },
      { id: "C1", name: "Zone C1", status: "healthy", soilMoisture: 78, temperature: 22, humidity: 72, lastUpdated: new Date() },
      { id: "C2", name: "Zone C2", status: "healthy", soilMoisture: 82, temperature: 21, humidity: 74, lastUpdated: new Date() },
      { id: "C3", name: "Zone C3", status: "healthy", soilMoisture: 77, temperature: 23, humidity: 71, lastUpdated: new Date() },
      { id: "C4", name: "Zone C4", status: "healthy", soilMoisture: 79, temperature: 22, humidity: 73, lastUpdated: new Date() },
    ];

    zoneData.forEach(zone => this.zones.set(zone.id, zone));
  }

  private initializeAlerts() {
    const alertData: Alert[] = [
      {
        id: 1,
        zoneId: "A3",
        type: "irrigation",
        criticality: "high",
        title: "Soil Moisture Critical",
        description: "Immediate irrigation required",
        emoji: "🚨",
        resolved: false,
        createdAt: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
      },
      {
        id: 2,
        zoneId: "B2",
        type: "irrigation",
        criticality: "medium",
        title: "Low Water Levels",
        description: "Schedule irrigation within 24h",
        emoji: "💧",
        resolved: false,
        createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      },
      {
        id: 3,
        zoneId: "B4",
        type: "pest",
        criticality: "medium",
        title: "Pest Activity Detected",
        description: "Consider pest control measures",
        emoji: "🐛",
        resolved: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      }
    ];

    alertData.forEach(alert => this.alerts.set(alert.id, alert));
    this.currentAlertId = 4;
  }

  async getZones(): Promise<Zone[]> {
    return Array.from(this.zones.values());
  }

  async getZone(id: string): Promise<Zone | undefined> {
    return this.zones.get(id);
  }

  async updateZone(id: string, zoneData: Partial<InsertZone>): Promise<Zone | undefined> {
    const existingZone = this.zones.get(id);
    if (!existingZone) return undefined;

    const updatedZone: Zone = { ...existingZone, ...zoneData, lastUpdated: new Date() };
    this.zones.set(id, updatedZone);
    return updatedZone;
  }

  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => !alert.resolved)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getAlertsByZone(zoneId: string): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.zoneId === zoneId && !alert.resolved)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const id = this.currentAlertId++;
    const alert: Alert = { ...alertData, id, resolved: false, createdAt: new Date() };
    this.alerts.set(id, alert);
    return alert;
  }

  async resolveAlert(id: number): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;

    const updatedAlert: Alert = { ...alert, resolved: true };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async createFeedbackReport(reportData: InsertFeedbackReport): Promise<FeedbackReport> {
    const id = this.currentReportId++;
    const report: FeedbackReport = { ...reportData, id, status: "pending", createdAt: new Date() };
    this.feedbackReports.set(id, report);
    return report;
  }

  async getFeedbackReports(): Promise<FeedbackReport[]> {
    return Array.from(this.feedbackReports.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async updateFeedbackReportStatus(id: number, status: string): Promise<FeedbackReport | undefined> {
    const report = this.feedbackReports.get(id);
    if (!report) return undefined;

    const updatedReport: FeedbackReport = { ...report, status };
    this.feedbackReports.set(id, updatedReport);
    return updatedReport;
  }

  async createSolution(solutionData: InsertSolution): Promise<Solution> {
    const id = this.currentSolutionId++;
    const solution: Solution = { ...solutionData, id, createdAt: new Date() };
    this.solutions.set(id, solution);
    return solution;
  }

  async getSolutionByReportId(reportId: number): Promise<Solution | undefined> {
    return Array.from(this.solutions.values()).find(solution => solution.reportId === reportId);
  }
}

export const storage = new MemStorage();
