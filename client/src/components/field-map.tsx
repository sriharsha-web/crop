import type { Zone } from "@shared/schema";

interface FieldMapProps {
  zones: Zone[];
  onZoneSelect: (zoneId: string) => void;
}

export default function FieldMap({ zones, onZoneSelect }: FieldMapProps) {
  const getZoneColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "#8BC34A";
      case "warning":
        return "#FF9800";
      case "critical":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getZoneEmoji = (zone: Zone) => {
    if (zone.status === "critical") return "🚨";
    if (zone.status === "warning") {
      // Determine emoji based on zone conditions
      if (zone.soilMoisture && zone.soilMoisture < 40) return "💧";
      if (zone.temperature && zone.temperature > 26) return "🌡️";
      return "⚠️";
    }
    return "";
  };

  const zoneCoordinates = {
    A1: { x: 50, y: 50, points: "0,0 100,0 100,100 0,100" },
    A2: { x: 150, y: 50, points: "100,0 200,0 200,100 100,100" },
    A3: { x: 250, y: 50, points: "200,0 300,0 300,100 200,100" },
    A4: { x: 350, y: 50, points: "300,0 400,0 400,100 300,100" },
    B1: { x: 50, y: 150, points: "0,100 100,100 100,200 0,200" },
    B2: { x: 150, y: 150, points: "100,100 200,100 200,200 100,200" },
    B3: { x: 250, y: 150, points: "200,100 300,100 300,200 200,200" },
    B4: { x: 350, y: 150, points: "300,100 400,100 400,200 300,200" },
    C1: { x: 50, y: 250, points: "0,200 100,200 100,300 0,300" },
    C2: { x: 150, y: 250, points: "100,200 200,200 200,300 100,300" },
    C3: { x: 250, y: 250, points: "200,200 300,200 300,300 200,300" },
    C4: { x: 350, y: 250, points: "300,200 400,200 400,300 300,300" },
  };

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: "300px" }}>
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {zones.map(zone => {
          const coords = zoneCoordinates[zone.id as keyof typeof zoneCoordinates];
          if (!coords) return null;

          const emoji = getZoneEmoji(zone);
          
          return (
            <g key={zone.id}>
              <polygon
                points={coords.points}
                fill={getZoneColor(zone.status)}
                stroke="white"
                strokeWidth="2"
                opacity="0.8"
                className="cursor-pointer hover:opacity-100 transition-opacity"
                onClick={() => onZoneSelect(zone.id)}
              />
              <text
                x={coords.x}
                y={emoji ? coords.y - 10 : coords.y}
                className="text-sm font-medium fill-white text-center pointer-events-none"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {zone.id}
              </text>
              {emoji && (
                <text
                  x={coords.x}
                  y={coords.y + 15}
                  className={`text-lg text-center pointer-events-none ${
                    zone.status === "critical" ? "animate-pulse" : ""
                  }`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {emoji}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600 px-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>Healthy</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>Critical</span>
          </div>
        </div>
        <span className="text-xs">Tap zones for details</span>
      </div>
    </div>
  );
}
