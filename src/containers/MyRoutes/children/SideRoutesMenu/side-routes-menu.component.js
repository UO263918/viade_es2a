import React from 'react';

import {
  SideMenuHolder,
  RouteContainer,
  SideMenuHeader,
  CollapseButton
} from './side-routes-menu.style';

import { useTranslation } from 'react-i18next';
import { RouteCard } from '@components';

const SideRoutesMenu = ({ routes, collapsed, setCollapsed, sendShareNotification, webId }) => {
  const { t } = useTranslation();

  return <SideMenuHolder {...{ collapsed }}>
    <SideMenuHeader>
      {t("feed.sideFeed.recentRoutes")}
      {!collapsed && <CollapseButton onClick={() => setCollapsed(true)}>⇢</CollapseButton>}
    </SideMenuHeader>

    <RouteContainer>
      {routes.map(route => <RouteCard key={route.id} {... { route }} />)}
    </RouteContainer>
  </SideMenuHolder>
}

export default SideRoutesMenu;
