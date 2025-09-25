import { getServices } from '@/app/actions/parasol';
import { ParasolSettingsPage } from '@/app/components/parasol/ParasolSettingsPage';

export default async function ParasolDomainLanguagePage() {
  const services = await getServices();

  return <ParasolSettingsPage initialServices={services} />;
}