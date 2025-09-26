import { getServices } from '@/app/actions/parasol';
import { ParasolSettingsPage2 } from '@/app/components/parasol/ParasolSettingsPage2';

export default async function ParasolDomainLanguagePage() {
  const result = await getServices();
  const services = result.success ? result.data : [];

  return <ParasolSettingsPage2 initialServices={services} />;
}