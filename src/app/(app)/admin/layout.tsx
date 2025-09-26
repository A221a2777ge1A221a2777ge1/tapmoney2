import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== '1') {
    redirect('/admin/login');
  }
  return <>{children}</>;
}