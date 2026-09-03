import { notFound } from 'next/navigation';
import { getEventBySlug, DEFAULT_MARIA_EVENT } from '@/lib/supabase';
import { InvitationPage } from '@/components/InvitationPage';

interface DynamicInvitationPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export default async function DynamicInvitationPage({ params }: DynamicInvitationPageProps) {
  const { slug } = params;

  // Cargar datos del evento dinámicamente por slug
  let event = await getEventBySlug(slug);

  // Si el slug es 'maria' y no retornó datos de Supabase, usar fallback de María
  if (!event && slug === 'maria') {
    event = DEFAULT_MARIA_EVENT;
  }

  // Si no se encuentra el evento, mostrar 404 de Next.js
  if (!event) {
    notFound();
  }

  // Reutilizar el mismo componente unificado InvitationPage sin duplicar código
  return <InvitationPage event={event} />;
}
