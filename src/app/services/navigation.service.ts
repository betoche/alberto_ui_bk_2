import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  constructor() {}
  iconMenu: IMenuItem[] = [
    {
      name: 'HOME',
      type: 'icon',
      tooltip: 'HOME',
      icon: 'home',
      state: '/',
    },
    {
      name: 'PROFILE',
      type: 'icon',
      tooltip: 'PROFILE',
      icon: 'person',
      state: 'dashboard/edit_profile',
    },
    {
      type: 'separator',
      name: 'Main Items',
    },
    {
      name: 'MY_ACCOUNT',
      type: 'link',
      tooltip: 'MY_ACCOUNT',
      icon: 'account_circle',
      state: 'dashboard/profile',
    },
    {
      name: 'ROLES_AND_PERMISSION',
      type: 'link',
      tooltip: 'ROLES_AND_PERMISSION',
      icon: 'settings',
      state: 'dashboard/administrator-users',
    },
    {
      name: 'PRODUCTS',
      type: 'top-menu',
      tooltip: 'PRODUCTS',
      state: 'dashboard/medications'
    },
    {
      name: 'ALLIES_TOT',
      type: 'top-menu',
      tooltip: 'ALLIES_TOT',
      state: 'dashboard/companies'
    }
  ];

  separatorMenu: IMenuItem[] = [];

  plainMenu: IMenuItem[] = [];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = 'Frequently Accessed';
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    switch (menuType) {
      case 'separator-menu':
        this.menuItems.next(this.separatorMenu);
        break;
      case 'icon-menu':
        this.menuItems.next(this.iconMenu);
        break;
      default:
        this.menuItems.next(this.plainMenu);
    }
  }
}
