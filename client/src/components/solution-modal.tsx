import { X, CheckCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution: any;
}

export default function SolutionModal({ isOpen, onClose, solution }: SolutionModalProps) {
  const { toast } = useToast();

  if (!isOpen || !solution) return null;

  const resources = solution.resources ? JSON.parse(solution.resources) : {};

  const handleImplementSolution = () => {
    toast({
      title: "Solution implementation started",
      description: "Your solution has been scheduled for implementation.",
    });
    onClose();
  };

  const handleSaveForLater = () => {
    toast({
      title: "Solution saved",
      description: "Solution has been saved to your recommendations.",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-800">🤖 AI Solution</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Solution Path */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">📊 Optimal Solution Path</h3>
            <div className="space-y-2 text-sm">
              {solution.steps?.map((step: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Requirements */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">💧 Resource Requirements</h3>
            <div className="space-y-2 text-sm">
              {resources.water && (
                <div className="flex justify-between">
                  <span>Water needed:</span>
                  <span className="font-medium">{resources.water}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated time:</span>
                <span className="font-medium">{resources.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Total cost:</span>
                <span className="font-medium">{resources.cost}</span>
              </div>
              {resources.energy && (
                <div className="flex justify-between">
                  <span>Energy cost:</span>
                  <span className="font-medium">{resources.energy}</span>
                </div>
              )}
            </div>
          </div>

          {/* Alternative Options */}
          {solution.alternatives && solution.alternatives.length > 0 && (
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">🔄 Alternative Solutions</h3>
              <div className="space-y-2 text-sm">
                {solution.alternatives.map((alt: string, index: number) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 hover:bg-white rounded transition-colors"
                  >
                    <div className="text-gray-700">{alt}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleImplementSolution}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Implement Solution
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveForLater}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
