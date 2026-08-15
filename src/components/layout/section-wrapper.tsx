import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

const toneClasses = {
  paper: "bg-paper text-ink",
  sunken: "bg-paper-sunken text-ink",
  inverse: "bg-paper-inverse text-ink-inverse",
} as const;

export function SectionWrapper({
  id,
  tone = "paper",
  className,
  children,
}: {
  id?: string;
  tone?: keyof typeof toneClasses;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("py-8 lg:py-9", toneClasses[tone], className)}
    >
      <Container>{children}</Container>
    </section>
  );
}
