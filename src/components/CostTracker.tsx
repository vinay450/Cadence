import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UsageStats {
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

interface Props {
  usage: UsageStats;
}

export function CostTracker({ usage }: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Usage</CardTitle>
        <CardDescription>Track your Claude API usage and costs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <span>Input Tokens:</span>
            <span>{usage.inputTokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Output Tokens:</span>
            <span>{usage.outputTokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Input Cost:</span>
            <span>${usage.inputCost.toFixed(6)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Output Cost:</span>
            <span>${usage.outputCost.toFixed(6)}</span>
          </div>
          <div className="flex justify-between items-center font-bold">
            <span>Total Cost:</span>
            <span>${usage.totalCost.toFixed(6)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 