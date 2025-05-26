import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (solution: any) => void;
  preselectedZone?: string;
}

export default function FeedbackModal({ isOpen, onClose, onSubmit, preselectedZone }: FeedbackModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    selectedZone: "",
    issueType: "",
    criticality: "",
    description: "",
    desiredAction: "",
    urgency: "",
  });

  useEffect(() => {
    if (preselectedZone) {
      setFormData(prev => ({ ...prev, selectedZone: preselectedZone }));
    }
  }, [preselectedZone]);

  const resetForm = () => {
    setFormData({
      selectedZone: "",
      issueType: "",
      criticality: "",
      description: "",
      desiredAction: "",
      urgency: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiRequest("POST", "/api/feedback", {
        zoneId: formData.selectedZone,
        issueType: formData.issueType,
        criticality: formData.criticality,
        description: formData.description,
        desiredAction: formData.desiredAction,
        urgency: formData.urgency,
      });

      const data = await response.json();
      
      toast({
        title: "Feedback submitted successfully",
        description: "AI solution has been generated for your issue.",
      });

      resetForm();
      onSubmit(data.solution);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <Card className="w-full rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-800">Report Field Issue</h2>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Zone Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Select Zone</Label>
            <Select
              value={formData.selectedZone}
              onValueChange={(value) => setFormData(prev => ({ ...prev, selectedZone: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a zone..." />
              </SelectTrigger>
              <SelectContent>
                {["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"].map(zone => (
                  <SelectItem key={zone} value={zone}>Zone {zone}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Issue Type */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Issue Type</Label>
            <Select
              value={formData.issueType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, issueType: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select issue type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="irrigation">💧 Irrigation/Water Issues</SelectItem>
                <SelectItem value="pest">🐛 Pest Infestation</SelectItem>
                <SelectItem value="disease">🦠 Plant Disease</SelectItem>
                <SelectItem value="soil">🌱 Soil Problems</SelectItem>
                <SelectItem value="weather">⛈️ Weather Damage</SelectItem>
                <SelectItem value="equipment">⚙️ Equipment Failure</SelectItem>
                <SelectItem value="other">❓ Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Criticality Level */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Criticality Level</Label>
            <RadioGroup
              value={formData.criticality}
              onValueChange={(value) => setFormData(prev => ({ ...prev, criticality: value }))}
              className="grid grid-cols-3 gap-3"
            >
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-sm cursor-pointer">🟢 Low</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-sm cursor-pointer">🟡 Medium</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-sm cursor-pointer">🔴 High</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Describe the Issue</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide details about the issue you're experiencing..."
              rows={4}
              required
            />
          </div>

          {/* Desired Action */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">What action would you like to take?</Label>
            <Select
              value={formData.desiredAction}
              onValueChange={(value) => setFormData(prev => ({ ...prev, desiredAction: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preferred action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate_irrigation">🚿 Immediate Irrigation</SelectItem>
                <SelectItem value="pest_control">🧪 Apply Pest Control</SelectItem>
                <SelectItem value="soil_treatment">🌿 Soil Treatment</SelectItem>
                <SelectItem value="equipment_repair">🔧 Equipment Repair</SelectItem>
                <SelectItem value="expert_consultation">👨‍🌾 Expert Consultation</SelectItem>
                <SelectItem value="ai_recommendation">🤖 Get AI Recommendation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Urgency Timeline */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">When do you need this resolved?</Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate" className="text-sm cursor-pointer">🚨 Immediately (within 1 hour)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                <RadioGroupItem value="today" id="today" />
                <Label htmlFor="today" className="text-sm cursor-pointer">⏰ Today (within 24 hours)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                <RadioGroupItem value="week" id="week" />
                <Label htmlFor="week" className="text-sm cursor-pointer">📅 This week (within 7 days)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "🚀 Submit & Get Solution"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
