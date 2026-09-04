import { Cpu, CircuitBoard, MemoryStick, HardDrive, Fan, PlugZap, Box, Gpu } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../sidebar";

const components = [
  {
    name: "CPU",
    id: "cpu",
    icon: Cpu,
  },
  {
    name: "GPU",
    id: "gpu",
    icon: Gpu,
  },
  {
    name: "MOTHERBOARD",
    id: "motherboard",
    icon: CircuitBoard,
  },
  {
    name: "MEMORY",
    id: "ram",
    icon: MemoryStick,
  },
  {
    name: "STORAGE",
    id: "storage",
    icon: HardDrive,
  },
  {
    name: "COOLING",
    id: "cooler",
    icon: Fan,
  },
  {
    name: "PSU",
    id: "psu",
    icon: PlugZap,
  },
  {
    name: "CASE",
    id: "case",
    icon: Box,
  },
];

type ComponentSidebarProps = {
  selectedComponent: string;
  onSelectComponent: (componentId: string) => void;
};

export function ComponentSidebar({
  selectedComponent,
  onSelectComponent,
}: ComponentSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border bg-sidebar">
      <SidebarContent className="pt-20">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-5 font-mono text-[10px] tracking-[0.25em] text-muted">
            PART INDEX / 01
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {components.map((component) => {
              const Icon = component.icon;
              const active = selectedComponent === component.id;

              return (
                <SidebarMenuItem key={component.id}>
                  <SidebarMenuButton
                    isActive={active}
                    onClick={() => onSelectComponent(component.id)}
                    className="
                            relative
                            h-11
                            rounded-none
                            border-l-2
                            border-transparent
                            font-mono
                            text-xs
                            tracking-[0.15em]
                            text-muted

                            hover:bg-accent-soft
                            hover:text-text

                            data-[active=true]:border-accent
                            data-[active=true]:bg-accent-soft
                            data-[active=true]:text-accent-dark
"
                  >
                    <Icon className="size-4" />

                    <span>{component.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
