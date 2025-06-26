import { useState, useEffect } from 'react';

export function useResourceManager({ listFn, deleteFn }) {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  console.log(items)

  useEffect(() => {
    setLoading(true);
    listFn().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, [listFn]);

  const confirmDelete = item => setToDelete(item);
  const cancelDelete = () => setToDelete(null);

  const doDelete = id => {
    deleteFn(id).then(() => {
      setItems(prev => prev.filter(i => i.id !== id));
      setToDelete(null);
    });
  };

  return {
    items,
    loading,
    toDelete,
    confirmDelete,
    cancelDelete,
    doDelete,
  };
}
