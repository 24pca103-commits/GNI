import { useEffect, useState } from 'react';
import { fetchActiveCourses } from '../services/api';
import { getOfferingKind, sortOfferings } from '../utils/offerings';

/**
 * Loads active offerings of one kind ('workshop' | 'journey') from the admin-managed API.
 * Returns null while the first request is in flight. Refreshes when the tab regains focus,
 * on visibility changes, or via polite background polling so users always see live data.
 */
export default function useOfferings(kind, canonicalIds = []) {
  const [offerings, setOfferings] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const list = await fetchActiveCourses();
        if (!active) return;
        const filtered = (list || []).filter((c) => getOfferingKind(c) === kind);
        setOfferings(sortOfferings(filtered, canonicalIds));
      } catch (err) {
        console.warn(`[useOfferings:${kind}]`, err);
        if (active) setOfferings((prev) => prev || []);
      }
    };

    // Initial load immediately on mount / refresh
    load();

    // Polite background sync every 45s (only if the page is currently visible to avoid CPU load)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        load();
      }
    }, 45000);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        load();
      }
    };

    window.addEventListener('storage', load);
    window.addEventListener('focus', load);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener('storage', load);
      window.removeEventListener('focus', load);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
    // canonicalIds is a static ordering hint supplied by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  return offerings;
}
