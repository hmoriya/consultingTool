import { getServices } from '@/app/actions/parasol';
import { ParasolSettingsPage2 } from '@/components/parasol/ParasolSettingsPage2';
import AppLayout from '@/app/components/layouts/app-layout';

export default async function ParasolPage() {
  const result = await getServices();
  const services = result.success && result.data ? result.data : [];

  return (
    <AppLayout>
      <ParasolSettingsPage2 initialServices={services} />
    </AppLayout>
  );
}