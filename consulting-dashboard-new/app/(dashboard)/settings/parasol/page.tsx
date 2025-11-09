import { getServices } from '@/app/actions/parasol';
import { ParasolSettingsPage2 } from '@/app/components/parasol/ParasolSettingsPage2';

export default async function ParasolDomainLanguagePage() {
  const result = await getServices();
  const services = result.success ? result.data || [] : [];

  // デバッグログ
  console.log('ParasolDomainLanguagePage: services loaded');
  services?.forEach(service => {
    if (service.name === 'knowledge-service' || service.name === 'finance-service' || service.name === 'notification-service') {
      console.log(`Service: ${service.name}`);
      console.log(`  Capabilities: ${service.capabilities?.length || 0}`);
      service.capabilities?.forEach(cap => {
        console.log(`    ${cap.name}: ${cap.businessOperations?.length || 0} operations`);
      });
    }
  });

  return <ParasolSettingsPage2 initialServices={services} />;
}