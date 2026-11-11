// Visitor Counter API Service for Ramen Genealogy
// Uses CountAPI (mileshilliard.com) with sessionStorage deduplication and localStorage fallback
// Strictly displays real, non-inflated visitor session counts starting from actual data.

export interface VisitorStats {
  today: number;
  total: number;
  isRemoteVerified: boolean;
}

const TOTAL_KEY = 'raspos_ramen_genealogy_total_v1';
const SESSION_KEY = 'ramen_pub_session_counted_v2';
const STORAGE_PREFIX = 'ramen_pub_v2_';

function getTodayKey(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `raspos_ramen_genealogy_d_${yyyy}${mm}${dd}`;
}

function getStoredDateStr(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

export function getLocalCachedStats(): VisitorStats {
  try {
    const todayStr = getStoredDateStr();
    const savedDate = localStorage.getItem(`${STORAGE_PREFIX}date`);
    const savedToday = parseInt(localStorage.getItem(`${STORAGE_PREFIX}today`) || '1', 10);
    const savedTotal = parseInt(localStorage.getItem(`${STORAGE_PREFIX}total`) || '1', 10);

    return {
      today: savedDate === todayStr && savedToday > 0 ? savedToday : 1,
      total: savedTotal > 0 ? savedTotal : 1,
      isRemoteVerified: false,
    };
  } catch {
    return {
      today: 1,
      total: 1,
      isRemoteVerified: false,
    };
  }
}

async function fetchWithTimeout(url: string, timeoutMs = 4000): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchVisitorStats(): Promise<VisitorStats> {
  const local = getLocalCachedStats();
  const todayStr = getStoredDateStr();
  const todayKey = getTodayKey();

  let isNewSession = true;
  try {
    isNewSession = !sessionStorage.getItem(SESSION_KEY);
  } catch {
    isNewSession = false;
  }

  const action = isNewSession ? 'hit' : 'get';
  const totalUrl = `https://countapi.mileshilliard.com/api/v1/${action}/${TOTAL_KEY}`;
  const todayUrl = `https://countapi.mileshilliard.com/api/v1/${action}/${todayKey}`;

  try {
    const [totalData, todayData] = await Promise.all([
      fetchWithTimeout(totalUrl),
      fetchWithTimeout(todayUrl),
    ]);

    let remoteTotal = typeof totalData?.value === 'number' ? totalData.value : null;
    let remoteToday = typeof todayData?.value === 'number' ? todayData.value : null;

    // If key didn't exist yet on remote, initialize with hit
    if (remoteTotal === null && action === 'get') {
      const initTotal = await fetchWithTimeout(`https://countapi.mileshilliard.com/api/v1/hit/${TOTAL_KEY}`);
      if (typeof initTotal?.value === 'number') remoteTotal = initTotal.value;
    }
    if (remoteToday === null && action === 'get') {
      const initToday = await fetchWithTimeout(`https://countapi.mileshilliard.com/api/v1/hit/${todayKey}`);
      if (typeof initToday?.value === 'number') remoteToday = initToday.value;
    }

    const finalTotal = remoteTotal !== null ? Math.max(1, remoteTotal) : local.total;
    const finalToday = remoteToday !== null ? Math.max(1, remoteToday) : local.today;
    const isVerified = remoteTotal !== null || remoteToday !== null;

    try {
      localStorage.setItem(`${STORAGE_PREFIX}date`, todayStr);
      localStorage.setItem(`${STORAGE_PREFIX}today`, String(finalToday));
      localStorage.setItem(`${STORAGE_PREFIX}total`, String(finalTotal));
      // Remove any legacy v1 fake baseline from localStorage
      localStorage.removeItem('ramen_pub_date_v1');
      localStorage.removeItem('ramen_pub_today_v1');
      localStorage.removeItem('ramen_pub_total_v1');

      if (isNewSession) {
        sessionStorage.setItem(SESSION_KEY, '1');
      }
    } catch {}

    return {
      today: finalToday,
      total: finalTotal,
      isRemoteVerified: isVerified,
    };
  } catch {
    return local;
  }
}
