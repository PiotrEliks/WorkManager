import React, { useState, useEffect } from 'react'
import ResourceManager from '../../components/ResourceManager'
import { useProtectiveEquipmentStore } from '../../store/useProtectiveEquipmentStore'
import useDocumentTitle from '../../lib/useDocumentTitle'
import { isAfterDeadline, isDeadline, dateFormat } from '../../lib/deadline'
import { ResourceActions } from '../../components/ResourceActions'
import { useLocation, useNavigate } from 'react-router-dom'

const ProtectiveEquipmentPage = () => {
  useDocumentTitle('Sprzęt ochronny | Panel Elektropomiar')
    const { equipment, totalItems, getEq, deleteEq, isEquipmentLoading, searchQuery, setSearchQuery, sortConfig, setSortConfig } = useProtectiveEquipmentStore()
  
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page'), 10) || 1;
    const currentPageSize = parseInt(queryParams.get('pageSize'), 10) || 10;
    const currentType = queryParams.get('type') || 'elektropomiar';

    const [pageSize, setPageSize] = useState(currentPageSize);
    const [page, setPage] = useState(currentPage);
    const [type, setType] = useState(currentType);

    useEffect(() => {
    const newType = queryParams.get('type') || 'elektropomiar';
    if (newType !== type) {
      setType(newType);
    }
  }, [location.search]);

    useEffect(() => {
      if (pageSize && page) {
        getEq(page, pageSize, type, false, searchQuery, sortConfig);
      }
    }, [page, pageSize, getEq, type, searchQuery, sortConfig]);

    useEffect(() => {
       navigate(`?page=${page}&pageSize=${pageSize}&type=${type}`, { replace: true });
    }, [page, pageSize, type, navigate]);

    const columns = [
      { key: 'name', label: "Nazwa" }, 
      { key: 'factoryNumber', label: "Nr fabr." }, 
      { key: 'protocolNumber', label: "Nr prot." }, 
      { 
        key: 'checkDate',
        label: "Data sprawdz.",
        getClassName: (val, row) => {
          if (isAfterDeadline(row.nextCheckDate)) return 'bg-red-500 text-white rounded px-2';
          if (isDeadline(val, 30)) return 'bg-orange-400 text-white rounded px-2';
          return 'bg-green-500 text-white rounded px-2';
        },
        getTitle: (val) => {
          if (isAfterDeadline(val)) return 'Termin upłynął';
          if (isDeadline(val, 30)) return 'Zbliża się termin';
          return 'Termin w bezpiecznym okresie';
        },
        render: (val) => dateFormat(val)
      }, 
      { 
        key: 'nextCheckDate', 
        label: "Nast. sprawdz.",
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
        render: (val) => dateFormat(val)
      }, 
      { key: 'comments', label: "Uwagi" }, 
      { key: 'editedBy', label: "Edyt. przez" }
    ]

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <ResourceManager
      name="sprzet-ochronny"
      columns={columns}
      items={equipment}
      loading={isEquipmentLoading}
      fetchItems={getEq}
      deleteItem={deleteEq}
       renderActions={(eq, confirmDelete) => (
        <ResourceActions
          entity={{ ...eq, _label: eq.name }}
          confirmDelete={confirmDelete}
        />
      )}
      handlePageChange={handlePageChange}
      currentPage={page}
      pageSize={pageSize}
      totalItems={totalItems}
      handlePageSizeChange={handlePageSizeChange}
      type={type}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      sortConfig={sortConfig}
      setSortConfig={setSortConfig}
    />
  )
}

export default ProtectiveEquipmentPage
