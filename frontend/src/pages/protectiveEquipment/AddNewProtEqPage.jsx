import React, { useState } from 'react'
import DataForm from '../../components/forms/DataForm.jsx'
import { Tag, Hash, Building2, Calendar, Clock, CheckCircle, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore.js'
import { useProtectiveEquipmentStore } from '../../store/useProtectiveEquipmentStore.js'
import useDocumentTitle from '../../lib/useDocumentTitle.jsx';

const AddNewProtEqPage = () => {
  useDocumentTitle('Dodaj sprzęt ochronny | Panel Elektropomiar');
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type') || 'elektropomiar';
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { addEq, isAdding } = useProtectiveEquipmentStore();
  const [formData, setFormData] = useState({
      name: "",
      factoryNumber: "",
      protocolNumber: "",
      checkDate: "",
      nextCheckDate: "",
      comments: "",
      editedBy: authUser.fullName,
      type: type
    });
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      await addEq(formData);
      setFormData({ name: "", factoryNumber: "", protocolNumber: "", checkDate: "", nextCheckDate: "", comments: "", editedBy: authUser.fullName, type: type });
      navigate(`/sprzet-ochronny?page=1&pageSize=10&type=${type}`);
    }
    
  return (
    <div>
      <DataForm
        fields={[
          { label: "Nazwa", icon: Tag, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "Wprowadź nazwę" },
          { label: "Numer fabryczny", icon: Hash, value: formData.factoryNumber, onChange: (e) => setFormData({ ...formData, factoryNumber: e.target.value }), placeholder: "Wprowadź numer fabryczny" },
          { label: "Numer protokołu", icon: FileText, value: formData.protocolNumber, onChange: (e) => setFormData({ ...formData, protocolNumber: e.target.value }), placeholder: "Wprowadź numer protokołu" },
          { label: "Data sprawdzenia", icon: Calendar, value: formData.checkDate, onChange: (e) => setFormData({ ...formData, checkDate: e.target.value }), type: "date" },
          { label: "Następne sprawdzenie", icon: Clock, value: formData.nextCheckDate, onChange: (e) => setFormData({ ...formData, nextCheckDate: e.target.value }), type: "date" },
          { label: "Uwagi", icon: CheckCircle, value: formData.comments, onChange: (e) => setFormData({ ...formData, comments: e.target.value }), placeholder: "Wprowadź uwagi" }
        ]}
        onSubmit={handleSubmit}
        onCancel={() => {
          navigate(`/sprzet-ochronny?page=1&pageSize=10&type=${type}`);
          setFormData({ editedBy: authUser.fullName });
        }}
        isSubmitting={isAdding}
        submitLabel="Dodaj nowy sprzęt ochronny"
      />
    </div>
  )
}

export default AddNewProtEqPage
