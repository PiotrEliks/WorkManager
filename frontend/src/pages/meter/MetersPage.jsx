import React, { useState, useEffect } from 'react';
import ResourceManager from '../../components/ResourceManager';
import { useMeterStore } from '../../store/useMeterStore';
import useDocumentTitle from '../../lib/useDocumentTitle';
import { isAfterDeadline, isDeadline, dateFormat } from '../../lib/deadline';
import { ResourceActions } from '../../components/ResourceActions';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MetersPage() {
  useDocumentTitle('Mierniki | Panel Elektropomiar');
  const { meters, totalItems, getMeters, deleteMeter, areMetersLoading } = useMeterStore();

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get('page'), 10) || 1;
  const currentPageSize = parseInt(queryParams.get('pageSize'), 10) || 10;

  const [pageSize, setPageSize] = useState(currentPageSize);
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    if (pageSize && page) {
      getMeters(page, pageSize);
    }
  }, [page, pageSize, getMeters]);

  useEffect(() => {
    navigate(`?page=${page}&pageSize=${pageSize}`, { replace: true });
  }, [page, pageSize, navigate]);

  const columns = [
    { key: 'type', label: 'Typ' },
    { key: 'number', label: 'Nr' },
    { key: 'producer', label: 'Producent' },
    {
      key: 'checkDate',
      label: 'Data spraw.',
      getClassName: (val, row) => {
        if (isAfterDeadline(row.nextCheckDate)) return 'bg-red-500 text-white rounded px-2';
        if (isDeadline(val, 30)) return 'bg-orange-500 text-white rounded px-2';
        return 'bg-green-500 text-white rounded px-2';
      },
      getTitle: (val) => {
        if (isAfterDeadline(val)) return 'Termin upłynął';
        if (isDeadline(val, 30)) return 'Zbliża się termin';
        return 'Termin w bezpiecznym okresie';
      },
      render: (val) => dateFormat(val),
    },
    {
      key: 'nextCheckDate',
      label: 'Nast. sprawdz.',
      getClassName: (val) => {
        if (isAfterDeadline(val)) return 'bg-red-500 text-white rounded px-2';
        if (isDeadline(val, 30)) return 'bg-orange-400 text-white rounded px-2';
        return 'bg-green-500 text-white rounded px-2';
      },
      getTitle: (val) => {
        if (isAfterDeadline(val)) return 'Termin upłynął';
        if (isDeadline(val, 30)) return 'Zbliża się termin';
        return 'Termin w bezpiecznym okresie';
      },
      render: (val) => dateFormat(val),
    },
    { key: 'nextcheckin', label: 'Okres (msc)' },
    { key: 'condition', label: 'Stan' },
    { key: 'comments', label: 'Uwagi' },
    { key: 'editedBy', label: 'Edyt. przez' },
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <ResourceManager
      name="mierniki"
      columns={columns}
      items={meters}
      loading={areMetersLoading}
      fetchItems={getMeters}
      deleteItem={deleteMeter}
      renderActions={(meter, confirmDelete) => (
        <ResourceActions
          entity={{ ...meter, _label: `${meter.type} ${meter.number}` }}
          confirmDelete={confirmDelete}
        />
      )}
      handlePageChange={handlePageChange}
      currentPage={page}
      pageSize={pageSize}
      totalItems={totalItems}
      handlePageSizeChange={handlePageSizeChange}
    />
  );
}
