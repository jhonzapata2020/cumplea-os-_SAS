import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
let supabaseUrl = 'https://beliwkapymtlufcytwxi.supabase.co';
let supabaseKey = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const k = parts[0].trim();
      const v = parts.slice(1).join('=').trim();
      if (k === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = v;
      if (k === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = v;
      if (k === 'SUPABASE_SERVICE_ROLE_KEY') supabaseKey = v;
    }
  });
}

async function main() {
  const endpoint = `${supabaseUrl}/rest/v1/guests?select=id,full_name,whatsapp,created_at,rsvps(attending,guest_count,message)&order=full_name.asc`;

  console.log('Querying Supabase REST API:', endpoint);

  const res = await fetch(endpoint, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error('Error HTTP from Supabase:', res.status, res.statusText);
    const body = await res.text();
    console.error('Body:', body);
    return;
  }

  const guests = await res.json();

  console.log(`\n========================================================================================`);
  console.log(` LISTA COMPLETA DE INVITADOS Y PASES REGISTRADOS EN LA BASE DE DATOS (${guests.length})`);
  console.log(`========================================================================================\n`);

  let totalConfirmedMainGuests = 0;
  let totalConfirmedCompanions = 0;
  let totalConfirmedPasses = 0;
  let totalPendingGuests = 0;
  let totalDeclinedGuests = 0;

  guests.forEach((g: any, i: number) => {
    const rsvp = Array.isArray(g.rsvps) ? g.rsvps[0] : g.rsvps;
    const attending = rsvp ? rsvp.attending : null;
    const guest_count = rsvp ? (rsvp.guest_count || 1) : 1;
    const companions = attending === true ? Math.max(0, guest_count - 1) : 0;
    const passes = attending === true ? guest_count : 0;

    let status = 'PENDIENTE';
    if (attending === true) {
      status = 'CONFIRMADO';
      totalConfirmedMainGuests++;
      totalConfirmedCompanions += companions;
      totalConfirmedPasses += passes;
    } else if (attending === false) {
      status = 'NO ASISTIRÁ';
      totalDeclinedGuests++;
    } else {
      totalPendingGuests++;
    }

    const numStr = String(i + 1).padStart(2, ' ');
    const nameStr = g.full_name.padEnd(32, ' ');
    const phoneStr = (g.whatsapp ? '+' + g.whatsapp : 'Sin tel').padEnd(16, ' ');
    const statusStr = status.padEnd(12, ' ');

    console.log(
      `${numStr}. ${nameStr} | ${phoneStr} | ${statusStr} | Total Pases: ${guest_count} (Titular: 1, Acompañantes: ${companions})`
    );
  });

  console.log(`\n========================================================================================`);
  console.log(` RESUMEN Y SUMA DE PASES Y AFORO TOTAL EN LA BASE DE DATOS`);
  console.log(`========================================================================================`);
  console.log(`- Invitados principales confirmados : ${totalConfirmedMainGuests}`);
  console.log(`- Acompañantes adicionales         : ${totalConfirmedCompanions}`);
  console.log(`- TOTAL DE PERSONAS / PASES        : ${totalConfirmedPasses}`);
  console.log(`- Invitados pendientes             : ${totalPendingGuests}`);
  console.log(`- Invitados que no asistirán       : ${totalDeclinedGuests}`);
  console.log(`========================================================================================\n`);
}

main();
