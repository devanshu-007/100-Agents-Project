import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  chatPanel: ReactNode;
  reportPanel: ReactNode;
}

export function AppLayout({ chatPanel, reportPanel }: AppLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      aside={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          AI Agent Console
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {chatPanel}
      </AppShell.Navbar>

      <AppShell.Main>
        {/* Main content can go here if needed, or leave empty */}
      </AppShell.Main>

      <AppShell.Aside p="md">
        {reportPanel}
      </AppShell.Aside>
    </AppShell>
  );
} 