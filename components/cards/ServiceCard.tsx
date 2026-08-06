import { Card, Heading, Text } from "@/components/ui";

type ServiceCardProps = {
  index: number;
  title: string;
  description: string;
};

export function ServiceCard({ index, title, description }: ServiceCardProps) {
  return (
    <Card variant="accent" className="h-full">
      <span className="text-sm text-text-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <Heading as={3} size="xl" className="mt-3">
        {title}
      </Heading>
      <Text tone="muted" className="mt-3">
        {description}
      </Text>
    </Card>
  );
}
