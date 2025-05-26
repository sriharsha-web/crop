import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFeedbackReportSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all zones
  app.get("/api/zones", async (req, res) => {
    try {
      const zones = await storage.getZones();
      res.json(zones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch zones" });
    }
  });

  // Get zone by ID
  app.get("/api/zones/:id", async (req, res) => {
    try {
      const zone = await storage.getZone(req.params.id);
      if (!zone) {
        return res.status(404).json({ message: "Zone not found" });
      }
      res.json(zone);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch zone" });
    }
  });

  // Get all alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Get alerts by zone
  app.get("/api/zones/:id/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlertsByZone(req.params.id);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch zone alerts" });
    }
  });

  // Resolve alert
  app.patch("/api/alerts/:id/resolve", async (req, res) => {
    try {
      const alert = await storage.resolveAlert(parseInt(req.params.id));
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to resolve alert" });
    }
  });

  // Submit feedback report
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackReportSchema.parse(req.body);
      const report = await storage.createFeedbackReport(validatedData);
      
      // Generate solution using the algorithm
      const solution = await generateSolution(report);
      await storage.createSolution(solution);
      
      res.json({ report, solution });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });

  // Get solution for a report
  app.get("/api/reports/:id/solution", async (req, res) => {
    try {
      const solution = await storage.getSolutionByReportId(parseInt(req.params.id));
      if (!solution) {
        return res.status(404).json({ message: "Solution not found" });
      }
      res.json(solution);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch solution" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Solution generation algorithm (simplified pathfinding approach)
async function generateSolution(report: any) {
  const { issueType, criticality, zoneId, desiredAction, urgency } = report;
  
  // Get zone data for context
  const zone = await storage.getZone(zoneId);
  
  // Solution paths based on issue type and criticality
  const solutionMatrix = {
    irrigation: {
      high: {
        steps: [
          "Immediate soil moisture assessment",
          `Activate ${zoneId} irrigation system`,
          "Monitor soil saturation levels",
          "Adjust nearby zones accordingly"
        ],
        estimatedCost: 230,
        estimatedTime: 45,
        alternatives: [
          "Manual irrigation + soil amendment (Cost: $15.50 | Time: 2 hours)",
          "Wait for scheduled rain (40% chance) (Cost: $0 | Risk: Medium)"
        ]
      },
      medium: {
        steps: [
          "Schedule irrigation within 24 hours",
          "Check irrigation system functionality",
          "Monitor soil moisture trends",
          "Prepare backup irrigation plan"
        ],
        estimatedCost: 180,
        estimatedTime: 120,
        alternatives: [
          "Delayed irrigation with soil monitoring",
          "Rain-dependent strategy with backup plan"
        ]
      },
      low: {
        steps: [
          "Monitor soil moisture levels",
          "Schedule routine irrigation check",
          "Update irrigation schedule",
          "Document moisture trends"
        ],
        estimatedCost: 50,
        estimatedTime: 30,
        alternatives: [
          "Natural rainfall monitoring",
          "Gradual irrigation adjustment"
        ]
      }
    },
    pest: {
      high: {
        steps: [
          "Immediate pest identification",
          "Apply targeted pesticide treatment",
          "Isolate affected area",
          "Monitor spread to adjacent zones"
        ],
        estimatedCost: 450,
        estimatedTime: 90,
        alternatives: [
          "Organic pest control methods",
          "Biological pest management"
        ]
      },
      medium: {
        steps: [
          "Assess pest population levels",
          "Apply preventive treatments",
          "Increase monitoring frequency",
          "Prepare containment measures"
        ],
        estimatedCost: 280,
        estimatedTime: 60,
        alternatives: [
          "Natural predator introduction",
          "Crop rotation planning"
        ]
      },
      low: {
        steps: [
          "Regular pest monitoring",
          "Preventive spray application",
          "Environmental assessment",
          "Schedule follow-up inspection"
        ],
        estimatedCost: 120,
        estimatedTime: 30,
        alternatives: [
          "Companion planting strategy",
          "Habitat modification"
        ]
      }
    },
    soil: {
      high: {
        steps: [
          "Emergency soil testing",
          "Apply soil amendments",
          "Adjust pH levels",
          "Monitor plant response"
        ],
        estimatedCost: 380,
        estimatedTime: 180,
        alternatives: [
          "Gradual soil improvement program",
          "Crop-specific soil treatment"
        ]
      },
      medium: {
        steps: [
          "Comprehensive soil analysis",
          "Plan fertilization schedule",
          "Apply organic matter",
          "Monitor nutrient levels"
        ],
        estimatedCost: 220,
        estimatedTime: 120,
        alternatives: [
          "Slow-release fertilizer program",
          "Compost-based soil improvement"
        ]
      },
      low: {
        steps: [
          "Regular soil testing",
          "Maintain fertilization schedule",
          "Monitor soil health indicators",
          "Plan seasonal amendments"
        ],
        estimatedCost: 90,
        estimatedTime: 45,
        alternatives: [
          "Natural soil building methods",
          "Cover crop integration"
        ]
      }
    },
    disease: {
      high: {
        steps: [
          "Disease identification and diagnosis",
          "Apply targeted fungicide treatment",
          "Remove infected plant material",
          "Implement quarantine measures"
        ],
        estimatedCost: 520,
        estimatedTime: 120,
        alternatives: [
          "Organic disease management",
          "Resistant variety replacement"
        ]
      },
      medium: {
        steps: [
          "Monitor disease progression",
          "Apply preventive treatments",
          "Improve air circulation",
          "Adjust watering practices"
        ],
        estimatedCost: 310,
        estimatedTime: 90,
        alternatives: [
          "Cultural disease management",
          "Biological control agents"
        ]
      },
      low: {
        steps: [
          "Regular plant inspection",
          "Maintain optimal growing conditions",
          "Apply preventive sprays",
          "Document disease occurrences"
        ],
        estimatedCost: 150,
        estimatedTime: 60,
        alternatives: [
          "Environmental disease prevention",
          "Plant nutrition optimization"
        ]
      }
    },
    weather: {
      high: {
        steps: [
          "Assess weather damage extent",
          "Implement emergency protection",
          "Repair damaged infrastructure",
          "Plan recovery strategy"
        ],
        estimatedCost: 800,
        estimatedTime: 240,
        alternatives: [
          "Gradual infrastructure repair",
          "Temporary protection measures"
        ]
      },
      medium: {
        steps: [
          "Evaluate weather impact",
          "Apply protective measures",
          "Monitor plant stress levels",
          "Adjust growing practices"
        ],
        estimatedCost: 350,
        estimatedTime: 120,
        alternatives: [
          "Natural recovery monitoring",
          "Adaptive management strategies"
        ]
      },
      low: {
        steps: [
          "Monitor weather conditions",
          "Maintain protective equipment",
          "Prepare contingency plans",
          "Update weather alerts"
        ],
        estimatedCost: 100,
        estimatedTime: 30,
        alternatives: [
          "Weather tracking only",
          "Seasonal preparation planning"
        ]
      }
    },
    equipment: {
      high: {
        steps: [
          "Emergency equipment diagnosis",
          "Order replacement parts",
          "Implement temporary solutions",
          "Schedule immediate repairs"
        ],
        estimatedCost: 650,
        estimatedTime: 300,
        alternatives: [
          "Manual operation procedures",
          "Equipment rental solutions"
        ]
      },
      medium: {
        steps: [
          "Equipment performance assessment",
          "Schedule maintenance",
          "Order necessary parts",
          "Plan repair timeline"
        ],
        estimatedCost: 290,
        estimatedTime: 180,
        alternatives: [
          "Preventive maintenance program",
          "Equipment upgrade planning"
        ]
      },
      low: {
        steps: [
          "Routine equipment inspection",
          "Perform scheduled maintenance",
          "Update maintenance logs",
          "Plan future service"
        ],
        estimatedCost: 80,
        estimatedTime: 60,
        alternatives: [
          "Extended maintenance intervals",
          "Equipment monitoring systems"
        ]
      }
    }
  };

  // Get solution based on issue type and criticality
  const solution = solutionMatrix[issueType]?.[criticality] || solutionMatrix.irrigation.low;
  
  // Adjust solution based on urgency
  if (urgency === "immediate") {
    solution.estimatedTime = Math.max(15, solution.estimatedTime * 0.5);
    solution.estimatedCost = solution.estimatedCost * 1.2; // Rush cost
  }

  // Format resources
  const resources = {
    water: issueType === "irrigation" ? `${Math.floor(solution.estimatedTime * 10)} liters` : "N/A",
    time: `${solution.estimatedTime} minutes`,
    cost: `$${(solution.estimatedCost / 100).toFixed(2)}`,
    energy: issueType === "irrigation" ? `$${(solution.estimatedCost * 0.01).toFixed(2)}` : "N/A"
  };

  return {
    reportId: report.id,
    steps: solution.steps,
    resources: JSON.stringify(resources),
    alternatives: solution.alternatives,
    estimatedCost: solution.estimatedCost,
    estimatedTime: solution.estimatedTime
  };
}
