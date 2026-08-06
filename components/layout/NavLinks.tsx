import { TextLink } from "@/components/ui";

type NavItem = {
  id: string;
  label: string;
};

type NavLinksProps = {
  items: readonly NavItem[];
  variant?: "nav" | "navMobile";
  onNavigate?: () => void;
};

export function NavLinks({
  items,
  variant = "nav",
  onNavigate,
}: NavLinksProps) {
  return (
    <ul
      className={
        variant === "nav"
          ? "flex flex-wrap items-center justify-end gap-x-4 gap-y-2 lg:gap-x-5"
          : "flex flex-col gap-2"
      }
    >
      {items.map((item) => (
        <li key={item.id}>
          <TextLink
            href={`#${item.id}`}
            variant={variant}
            onClick={onNavigate}
          >
            {item.label}
          </TextLink>
        </li>
      ))}
    </ul>
  );
}
