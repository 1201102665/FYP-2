import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) =>
<nav
  role="navigation"
  aria-label="pagination"
  className={cn("mx-auto flex w-full justify-center", className)}
  {...props} data-id="g4fg2ssos" data-path="src/components/ui/pagination.tsx" />;


Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) =>
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props} data-id="fbudoz7qu" data-path="src/components/ui/pagination.tsx" />

);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">>(
  ({ className, ...props }, ref) =>
  <li ref={ref} className={cn("", className)} {...props} data-id="atc7dfe41" data-path="src/components/ui/pagination.tsx" />
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) =>
<a
  aria-current={isActive ? "page" : undefined}
  className={cn(
    buttonVariants({
      variant: isActive ? "outline" : "ghost",
      size
    }),
    className
  )}
  {...props} data-id="bfeen5se9" data-path="src/components/ui/pagination.tsx" />;


PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) =>
<PaginationLink
  aria-label="Go to previous page"
  size="default"
  className={cn("gap-1 pl-2.5", className)}
  {...props}>

    <ChevronLeft className="h-4 w-4" />
    <span data-id="0fwn2pdv5" data-path="src/components/ui/pagination.tsx">Previous</span>
  </PaginationLink>;

PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) =>
<PaginationLink
  aria-label="Go to next page"
  size="default"
  className={cn("gap-1 pr-2.5", className)}
  {...props}>

    <span data-id="lvctux45c" data-path="src/components/ui/pagination.tsx">Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>;

PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) =>
<span
  aria-hidden
  className={cn("flex h-9 w-9 items-center justify-center", className)}
  {...props} data-id="eilgajo88" data-path="src/components/ui/pagination.tsx">

    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only" data-id="m6kx6n698" data-path="src/components/ui/pagination.tsx">More pages</span>
  </span>;

PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis };