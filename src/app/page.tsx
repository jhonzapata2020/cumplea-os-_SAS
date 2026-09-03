import { getEventBySlug, DEFAULT_MARIA_EVENT } from '@/lib/supabase';
import { InvitationPage } from '@/components/InvitationPage';

export const revalidate = 60; // Revalidar datos cada 60 segundos si aplica

export default async function HomePage() {
  // Cargar datos del evento de María desde Supabase o usar fallback por defecto
  const event = (await getEventBySlug('maria')) || DEFAULT_MARIA_EVENT;

  return <InvitationPage event={event} />;
}
