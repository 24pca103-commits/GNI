import { useEffect, useState } from 'react';
import { fetchActiveCourses } from '../services/api';
import { getOfferingKind, sortOfferings } from '../utils/offerings';

/**
 * Loads active offerings of one kind ('workshop' | 'journey') from the admin-managed API.
 * Returns null while the first request is in flight. Refreshes when the tab regains focus
 * or another tab (the admin panel) signals a change through localStorage.
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

    load();
    window.addEventListener('storage', load);
    window.addEventListener('focus', load);
    return () => {
      active = false;
      window.removeEventListener('storage', load);
      window.removeEventListener('focus', load);
    };
    // canonicalIds is a static ordering hint supplied by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  return offerings;
}
