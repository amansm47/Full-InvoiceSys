import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';

export const useRealTimeQuery = (key, queryFn, options = {}) => {
  const [newDataAlert, setNewDataAlert] = useState(false);
  
  const query = useQuery(key, queryFn, {
    refetchInterval: options.interval || 10000, // Default 10 seconds
    onSuccess: (newData) => {
      if (options.onNewData) {
        const hasNewData = options.onNewData(newData, query.data);
        if (hasNewData) {
          setNewDataAlert(true);
          setTimeout(() => setNewDataAlert(false), 5000);
        }
      }
    },
    ...options
  });

  return { ...query, newDataAlert };
};
