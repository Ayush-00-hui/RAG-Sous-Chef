export enum Page {
  HOME = 'home',
  MEAL_PLANNER = 'meal_planner',
  FAVORITES = 'favorites',
}

export interface NavigationProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}
