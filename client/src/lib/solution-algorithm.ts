// Simplified pathfinding algorithm for agricultural problem-solving
// This implements a weighted graph approach to find optimal solutions

export interface ProblemNode {
  id: string;
  type: string;
  criticality: "low" | "medium" | "high";
  cost: number;
  time: number;
  effectiveness: number;
}

export interface SolutionPath {
  steps: string[];
  totalCost: number;
  totalTime: number;
  effectiveness: number;
  alternatives: string[];
}

export class AgriculturalSolutionFinder {
  private problemGraph: Map<string, ProblemNode[]>;
  
  constructor() {
    this.problemGraph = new Map();
    this.initializeGraph();
  }

  private initializeGraph() {
    // Initialize the problem-solution graph
    // Each problem type maps to possible solution nodes
    
    this.problemGraph.set("irrigation", [
      {
        id: "immediate_irrigation",
        type: "irrigation",
        criticality: "high",
        cost: 230,
        time: 45,
        effectiveness: 95
      },
      {
        id: "scheduled_irrigation",
        type: "irrigation",
        criticality: "medium",
        cost: 180,
        time: 120,
        effectiveness: 85
      },
      {
        id: "manual_irrigation",
        type: "irrigation",
        criticality: "low",
        cost: 50,
        time: 30,
        effectiveness: 70
      }
    ]);

    this.problemGraph.set("pest", [
      {
        id: "chemical_treatment",
        type: "pest",
        criticality: "high",
        cost: 450,
        time: 90,
        effectiveness: 90
      },
      {
        id: "organic_treatment",
        type: "pest",
        criticality: "medium",
        cost: 280,
        time: 60,
        effectiveness: 75
      },
      {
        id: "preventive_treatment",
        type: "pest",
        criticality: "low",
        cost: 120,
        time: 30,
        effectiveness: 60
      }
    ]);

    // Add more problem types...
  }

  // Dijkstra-inspired algorithm to find optimal solution path
  public findOptimalSolution(
    problemType: string,
    criticality: "low" | "medium" | "high",
    urgency: string,
    constraints: { maxCost?: number; maxTime?: number } = {}
  ): SolutionPath {
    const solutions = this.problemGraph.get(problemType) || [];
    
    // Filter solutions based on criticality and constraints
    const validSolutions = solutions.filter(solution => {
      if (constraints.maxCost && solution.cost > constraints.maxCost) return false;
      if (constraints.maxTime && solution.time > constraints.maxTime) return false;
      return true;
    });

    if (validSolutions.length === 0) {
      // Return default solution if no valid options
      return this.getDefaultSolution(problemType);
    }

    // Calculate weighted scores (effectiveness/cost ratio with time penalty)
    const scoredSolutions = validSolutions.map(solution => {
      let score = solution.effectiveness / solution.cost;
      
      // Apply urgency multiplier
      if (urgency === "immediate") {
        score *= (100 / solution.time); // Favor faster solutions
      }
      
      // Apply criticality weight
      const criticalityWeight = {
        high: 1.5,
        medium: 1.0,
        low: 0.7
      };
      score *= criticalityWeight[criticality];

      return { ...solution, score };
    });

    // Sort by score (descending)
    scoredSolutions.sort((a, b) => b.score - a.score);
    
    const optimalSolution = scoredSolutions[0];
    const alternatives = scoredSolutions.slice(1, 3);

    return {
      steps: this.generateSteps(optimalSolution),
      totalCost: optimalSolution.cost,
      totalTime: optimalSolution.time,
      effectiveness: optimalSolution.effectiveness,
      alternatives: alternatives.map(alt => 
        `${alt.id.replace(/_/g, ' ')} (Cost: $${(alt.cost/100).toFixed(2)} | Time: ${alt.time}min)`
      )
    };
  }

  private generateSteps(solution: ProblemNode): string[] {
    // Generate step-by-step instructions based on solution type
    const stepTemplates = {
      immediate_irrigation: [
        "Immediate soil moisture assessment",
        "Activate irrigation system",
        "Monitor soil saturation levels",
        "Adjust nearby zones accordingly"
      ],
      chemical_treatment: [
        "Immediate pest identification",
        "Apply targeted pesticide treatment",
        "Isolate affected area",
        "Monitor spread to adjacent zones"
      ],
      // Add more step templates...
    };

    return stepTemplates[solution.id as keyof typeof stepTemplates] || [
      "Assess the situation",
      "Apply recommended solution",
      "Monitor progress",
      "Adjust as needed"
    ];
  }

  private getDefaultSolution(problemType: string): SolutionPath {
    return {
      steps: [
        "Assess the problem thoroughly",
        "Consult with agricultural expert",
        "Implement recommended solution",
        "Monitor and adjust as needed"
      ],
      totalCost: 100,
      totalTime: 60,
      effectiveness: 70,
      alternatives: [
        "Manual intervention",
        "Wait and monitor approach"
      ]
    };
  }
}

// Export singleton instance
export const solutionFinder = new AgriculturalSolutionFinder();
