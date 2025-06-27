import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import Loader from './ui/Loader'
import DeleteConfirmation from './DeleteConfirmation';
import HeadBar from './HeadBar';

export default function ResourceManager({
  name,
  columns,
  items,
  loading,
  fetchItems,
  deleteItem,
  renderActions
}) {
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (!items) {
    return <Loader />;
  }

  return (
    <>
      <HeadBar
        tableColumns={columns}
        tableData={items}
        name={name}
      />
      <DataTable
        columns={columns}
        data={items}
        renderActions={(item) => renderActions(item, setToDelete)}
      />

      {toDelete && (
        <DeleteConfirmation
          itemLabel={toDelete._label}
          onConfirm={() => {
            deleteItem(toDelete.id);
            setToDelete(null);
          }}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
