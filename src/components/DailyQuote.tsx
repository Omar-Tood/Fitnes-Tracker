import { Card, CardContent } from "@/components/ui/card";

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Your future self will thank you.",
  "Small progress is still progress.",
  "Make yourself proud.",
  "Trust the process."
];

export function DailyQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="pt-6">
        <p className="text-lg font-medium text-center italic">"{randomQuote}"</p>
      </CardContent>
    </Card>
  );
}