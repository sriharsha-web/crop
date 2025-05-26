import { Home, Map, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BottomNavigation() {
  const navigationItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Map, label: "Field Map", active: false },
    { icon: BarChart3, label: "Reports", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center">
        {navigationItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`flex flex-col items-center space-y-1 py-2 px-4 h-auto ${
              item.active
                ? "text-green-500"
                : "text-gray-400 hover:text-green-500"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
