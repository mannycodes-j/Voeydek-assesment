import {
  FoldHorizontal,
  Hotel,
  Plane,
  GraduationCap,
  CreditCard,
  Luggage,
  BriefcaseMedical,
  Package,
} from 'lucide-react'

export const SIDEBAR_MENU_ITEMS = [
  { title: 'Activities', icon: FoldHorizontal, href: '/activities' },
  { title: 'Hotels', icon: Hotel, href: '/hotels' },
  { title: 'Flights', icon: Plane, href: '/flights' },
  { title: 'Study', icon: GraduationCap, href: '/study' },
  { title: 'Visa', icon: CreditCard, href: '/visa' },
  { title: 'Immigration', icon: Luggage, href: '/immigration' },
  { title: 'Medical', icon: BriefcaseMedical, href: '/medical' },
  { title: 'Vacation Packages', icon: Package, href: '/packages' },
]
