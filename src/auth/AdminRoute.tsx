import { ReactNode } from 'react';
import RequireAdmin from './RequireAdmin';

interface AdminRouteProps {
  children: ReactNode;
}

// Simple alias wrapper so code reads AdminRoute everywhere
export default function AdminRoute({ children }: AdminRouteProps) {
  return <RequireAdmin>{children}</RequireAdmin>;
}
