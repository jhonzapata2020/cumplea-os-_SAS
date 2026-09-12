/**
 * Utilidad de Rate Limiting en memoria para protección de endpoints administrativos (ADMIN_PIN)
 * Evita ataques de fuerza bruta limitando intentos por dirección IP.
 */

interface RateLimitRecord {
  attempts: number;
  firstAttemptTime: number;
  blockedUntil: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5; // Máximo de intentos permitidos
const WINDOW_MS = 15 * 60 * 1000; // Ventana de 15 minutos (900,000 ms)
const LOCKOUT_MS = 15 * 60 * 1000; // Tiempo de bloqueo de 15 minutos

/**
 * Verifica si la IP tiene permiso para intentar la autenticación
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    return { allowed: true, remaining: MAX_ATTEMPTS, retryAfterSeconds: 0 };
  }

  // Si la IP está bloqueada temporalmente
  if (record.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  // Si la ventana de tiempo ha expirado, reiniciar registro
  if (now - record.firstAttemptTime > WINDOW_MS) {
    rateLimitStore.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS, retryAfterSeconds: 0 };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.attempts);
  const allowed = record.attempts < MAX_ATTEMPTS;

  return { allowed, remaining, retryAfterSeconds: 0 };
}

/**
 * Registra un intento fallido para la IP especificada
 */
export function recordFailedAttempt(ip: string): { remaining: number; blocked: boolean } {
  const now = Date.now();
  let record = rateLimitStore.get(ip);

  if (!record || now - record.firstAttemptTime > WINDOW_MS) {
    record = {
      attempts: 1,
      firstAttemptTime: now,
      blockedUntil: 0,
    };
  } else {
    record.attempts += 1;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockedUntil = now + LOCKOUT_MS;
  }

  rateLimitStore.set(ip, record);
  const remaining = Math.max(0, MAX_ATTEMPTS - record.attempts);
  const blocked = record.attempts >= MAX_ATTEMPTS;

  return { remaining, blocked };
}

/**
 * Reinicia el conteo de la IP cuando ingresa el PIN correcto
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}
