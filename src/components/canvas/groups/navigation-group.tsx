'use client'

import { useState } from 'react'
import {
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  MessageSquareIcon,
  UserIcon,
  CalendarIcon,
  FileTextIcon,
  BookOpenIcon,
  CodeIcon,
} from 'lucide-react'

import { Specimen } from '@/components/canvas/specimen'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { COMPONENT_GROUPS } from '@/lib/constants'

const group = COMPONENT_GROUPS.find((g) => g.id === 'navigation')!

interface Props {
  showHeader?: boolean
}

// ─── Accordion ───────────────────────────────────────────────────────────────

function AccordionSpecimen() {
  return (
    <Specimen name="Accordion">
      <Accordion defaultValue={['item-1']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern and supports keyboard
            navigation and screen readers out of the box.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that match the other components.
            You can easily override them with your own classes or CSS variables.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default using CSS transitions. You can
            disable animations globally via the theme, or per-component by
            removing the animation classes.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Specimen>
  )
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function BreadcrumbSpecimen() {
  return (
    <Specimen name="Breadcrumb">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Documents</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current Project</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Specimen>
  )
}

// ─── Collapsible ─────────────────────────────────────────────────────────────

function CollapsibleSpecimen() {
  const [open, setOpen] = useState(false)
  const hiddenItems = ['Design systems', 'Component libraries', 'CSS variables']

  return (
    <Specimen name="Collapsible">
      <Collapsible open={open} onOpenChange={setOpen} className="w-full">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Starred repositories</h4>
          <CollapsibleTrigger
            render={
              <Button variant="ghost" size="sm">
                {open ? 'Hide' : `View ${hiddenItems.length} more`}
              </Button>
            }
          />
        </div>
        <div className="mt-2 rounded-md border border-border px-3 py-2 text-sm">
          @radix-ui/primitives
        </div>
        <CollapsibleContent className="mt-1 space-y-1">
          {hiddenItems.map((item) => (
            <div
              key={item}
              className="rounded-md border border-border px-3 py-2 text-sm"
            >
              {item}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </Specimen>
  )
}

// ─── Context Menu ─────────────────────────────────────────────────────────────

function ContextMenuSpecimen() {
  return (
    <Specimen name="Context Menu">
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground select-none">
            Right-click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem>Forward</ContextMenuItem>
          <ContextMenuItem>Reload</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Save As…</ContextMenuItem>
          <ContextMenuItem>Print…</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>View Source</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </Specimen>
  )
}

// ─── Dropdown Menu ────────────────────────────────────────────────────────────

function DropdownMenuSpecimen() {
  return (
    <Specimen name="Dropdown Menu">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline">Settings</Button>}
        />
        <DropdownMenuContent className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Team</DropdownMenuLabel>
            <DropdownMenuItem>Team members</DropdownMenuItem>
            <DropdownMenuItem>Invite users</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Specimen>
  )
}

// ─── Hover Card ───────────────────────────────────────────────────────────────

function HoverCardSpecimen() {
  return (
    <Specimen name="Hover Card">
      <HoverCard>
        <HoverCardTrigger className="cursor-pointer text-sm underline underline-offset-4">
          @nextjs
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex gap-3">
            <Avatar className="size-10">
              <AvatarImage src="https://github.com/vercel.png" />
              <AvatarFallback>NX</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@nextjs</h4>
              <p className="text-xs text-muted-foreground">
                The React Framework — created and maintained by @vercel.
              </p>
              <div className="flex gap-4 pt-1">
                <span className="text-xs text-muted-foreground">
                  <strong className="text-foreground">2.4k</strong> Following
                </span>
                <span className="text-xs text-muted-foreground">
                  <strong className="text-foreground">142k</strong> Followers
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </Specimen>
  )
}

// ─── Menubar ─────────────────────────────────────────────────────────────────

function MenubarSpecimen() {
  return (
    <Specimen name="Menubar">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Open <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Exit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Cut <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Copy <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Paste <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Fullscreen <MenubarShortcut>F11</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Specimen>
  )
}

// ─── Navigation Menu ──────────────────────────────────────────────────────────

const navLinks: { title: string; href: string; description: string }[] = [
  {
    title: 'Introduction',
    href: '#',
    description: 'Re-usable components built using Radix UI and Tailwind CSS.',
  },
  {
    title: 'Installation',
    href: '#',
    description: 'How to install dependencies and structure your app.',
  },
  {
    title: 'Typography',
    href: '#',
    description: 'Styles for headings, paragraphs, lists and more.',
  },
]

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '#',
    description: 'A modal dialog that interrupts the user with important content.',
  },
  {
    title: 'Hover Card',
    href: '#',
    description: 'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '#',
    description: 'Displays an indicator showing the progress of a task.',
  },
]

function NavigationMenuSpecimen() {
  return (
    <Specimen name="Navigation Menu">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-1 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink
                    href="#"
                    className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-xs leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </NavigationMenuLink>
                </li>
                {navLinks.map((link) => (
                  <li key={link.title}>
                    <NavigationMenuLink href={link.href}>
                      <div className="text-sm font-medium">{link.title}</div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {link.description}
                      </p>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-1 p-2 md:w-[500px] md:grid-cols-2">
                {components.map((component) => (
                  <li key={component.title}>
                    <NavigationMenuLink href={component.href}>
                      <div className="text-sm font-medium">
                        {component.title}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {component.description}
                      </p>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className={navigationMenuTriggerStyle()}
            >
              Documentation
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </Specimen>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function PaginationSpecimen() {
  return (
    <Specimen name="Pagination">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              5
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">9</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">10</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Specimen>
  )
}

// ─── Popover ─────────────────────────────────────────────────────────────────

function PopoverSpecimen() {
  return (
    <Specimen name="Popover">
      <Popover>
        <PopoverTrigger
          render={<Button variant="outline">Set dimensions</Button>}
        />
        <PopoverContent className="w-64">
          <div className="flex flex-col gap-3">
            <div className="text-sm font-medium">Dimensions</div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="popover-width" className="text-xs">
                Width
              </Label>
              <Input
                id="popover-width"
                defaultValue="100%"
                className="h-7 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="popover-height" className="text-xs">
                Height
              </Label>
              <Input
                id="popover-height"
                defaultValue="25px"
                className="h-7 text-xs"
              />
            </div>
            <Button size="sm">Apply</Button>
          </div>
        </PopoverContent>
      </Popover>
    </Specimen>
  )
}

// ─── Scroll Area ─────────────────────────────────────────────────────────────

function ScrollAreaSpecimen() {
  const tags = Array.from({ length: 20 }, (_, i) => `Tag ${i + 1}`)
  return (
    <Specimen name="Scroll Area">
      <ScrollArea className="h-48 w-full rounded-md border border-border">
        <div className="p-3">
          {tags.map((tag, i) => (
            <div key={tag}>
              <div className="py-1.5 text-sm">{tag}</div>
              {i < tags.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Specimen>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function SidebarSpecimen() {
  const navItems = [
    { icon: HomeIcon, label: 'Home', active: true },
    { icon: SearchIcon, label: 'Search', active: false },
    { icon: SettingsIcon, label: 'Settings', active: false },
    { icon: MessageSquareIcon, label: 'Messages', active: false },
    { icon: UserIcon, label: 'Profile', active: false },
  ]

  return (
    <Specimen name="Sidebar">
      <div className="flex w-12 flex-col gap-0.5 rounded-lg border border-border bg-sidebar p-1.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            aria-label={item.label}
            className={cn(
              'flex size-9 items-center justify-center rounded-md text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              item.active &&
                'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
            )}
          >
            <item.icon className="size-4" />
          </button>
        ))}
      </div>
    </Specimen>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function TabsSpecimen() {
  return (
    <Specimen name="Tabs">
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-3 space-y-2">
          <p className="text-sm text-muted-foreground">
            Manage your account details and preferences.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tabs-name" className="text-xs">
              Name
            </Label>
            <Input
              id="tabs-name"
              defaultValue="Pedro Duarte"
              className="h-7 text-xs"
            />
          </div>
        </TabsContent>
        <TabsContent value="password" className="mt-3 space-y-2">
          <p className="text-sm text-muted-foreground">
            Update your password to keep your account secure.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tabs-password" className="text-xs">
              New password
            </Label>
            <Input
              id="tabs-password"
              type="password"
              className="h-7 text-xs"
            />
          </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-3 space-y-2">
          <p className="text-sm text-muted-foreground">
            Configure notifications and display options.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tabs-email" className="text-xs">
              Notification email
            </Label>
            <Input
              id="tabs-email"
              type="email"
              defaultValue="pedro@example.com"
              className="h-7 text-xs"
            />
          </div>
        </TabsContent>
      </Tabs>
    </Specimen>
  )
}

// ─── Group ───────────────────────────────────────────────────────────────────

export function NavigationGroup({ showHeader = true }: Props) {
  return (
    <section id="section-navigation" className="space-y-6">
      {showHeader && (
        <div className="pb-2 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {group.label}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {group.components.length} components
          </p>
        </div>
      )}
      <AccordionSpecimen />
      <BreadcrumbSpecimen />
      <CollapsibleSpecimen />
      <ContextMenuSpecimen />
      <DropdownMenuSpecimen />
      <HoverCardSpecimen />
      <MenubarSpecimen />
      <NavigationMenuSpecimen />
      <PaginationSpecimen />
      <PopoverSpecimen />
      <ScrollAreaSpecimen />
      <SidebarSpecimen />
      <TabsSpecimen />
    </section>
  )
}
