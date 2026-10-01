import { useEffect, useState } from 'react';
import axios from 'axios';
import { JOB_API_ENDPOINT } from '@/utils/data';

export default function useGetRecommendedJobs() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(`${JOB_API_ENDPOINT}/recommendations`);
        if (mounted) setResults(res.data.results || []);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || err.message || 'Failed to fetch recommendations');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  return { loading, error, results };
}