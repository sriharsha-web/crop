import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Sprout, Bell, User, RotateCcw, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FieldMap from "@/components/field-map";
import FeedbackModal from "@/components/feedback-modal";
import SolutionModal from "@/components/solution-modal";
import BottomNavigation from "@/components/bottom-navigation";
import type { Zone, Alert } from "@shared/schema";

export default function Dashboard() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [currentSolution, setCurrentSolution] = useState<any>(null);

  const { data: zones = [], isLoading: zonesLoading, refetch: refetchZones } = useQuery<Zone[]>({
    queryKey: ["/api/zones"],
  });

  const { data: alerts = [], isLoading: alertsLoading, refetch: refetchAlerts } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const handleRefresh = () => {
    refetchZones();
    refetchAlerts();
  };

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = (solution: any) => {
    setCurrentSolution(solution);
    setShowFeedbackModal(false);
    setShowSolutionModal(true);
  };

  const getZoneStats = () => {
    const healthy = zones.filter(z => z.status === "healthy").length;
    const warning = zones.filter(z => z.status === "warning").length;
    const critical = zones.filter(z => z.status === "critical").length;
    return { healthy, warning, critical };
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes} minutes ago`;
    return `${hours} hours ago`;
  };

  const stats = getZoneStats();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-500 text-white shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sprout className="h-6 w-6" />
            <h1 className="text-xl font-medium">FarmZone Monitor</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-5 w-5" />
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {/* Field Status Overview */}
        <Card className="mx-4 mt-4 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">Field Overview</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={zonesLoading}
            >
              <RotateCcw className={`h-4 w-4 ${zonesLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{stats.healthy}</div>
              <div className="text-sm text-gray-600">Healthy Zones</div>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-orange-600">{stats.warning}</div>
              <div className="text-sm text-gray-600">Warning Zones</div>
            </div>
            <div className="bg-red-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <div className="text-sm text-gray-600">Critical Zones</div>
            </div>
          </div>
        </Card>

        {/* Interactive Field Map */}
        <Card className="mx-4 mt-4 p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Field Zone Map</h2>
          <FieldMap zones={zones} onZoneSelect={handleZoneSelect} />
        </Card>

        {/* Recent Alerts */}
        <Card className="mx-4 mt-4 p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Alerts</h2>
          {alertsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse p-3 bg-gray-100 rounded-lg">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🌱</div>
              <p>No active alerts. All zones are healthy!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    alert.criticality === "high"
                      ? "bg-red-50"
                      : alert.criticality === "medium"
                      ? "bg-orange-50"
                      : "bg-yellow-50"
                  }`}
                >
                  <div className="text-2xl">{alert.emoji}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      Zone {alert.zoneId}: {alert.title}
                    </div>
                    <div className="text-sm text-gray-600">{alert.description}</div>
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(alert.createdAt!)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="mx-4 mt-4 p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-20 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
              onClick={() => setShowFeedbackModal(true)}
            >
              <div className="text-2xl">💬</div>
              <span className="text-sm font-medium">Report Issue</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-20 border-green-200 hover:border-green-400 hover:bg-green-50"
              onClick={() => {}}
            >
              <div className="text-2xl">💧</div>
              <span className="text-sm font-medium">Schedule Irrigation</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-20 border-orange-200 hover:border-orange-400 hover:bg-orange-50"
              onClick={() => {}}
            >
              <div className="text-2xl">💡</div>
              <span className="text-sm font-medium">AI Suggestions</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-20 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              onClick={() => {}}
            >
              <div className="text-2xl">📊</div>
              <span className="text-sm font-medium">View History</span>
            </Button>
          </div>
        </Card>
      </main>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600"
        onClick={() => setShowFeedbackModal(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <BottomNavigation />
      
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        preselectedZone={selectedZone}
      />
      
      <SolutionModal
        isOpen={showSolutionModal}
        onClose={() => setShowSolutionModal(false)}
        solution={currentSolution}
      />
    </div>
  );
}
