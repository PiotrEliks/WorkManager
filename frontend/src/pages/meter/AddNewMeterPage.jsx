import React, { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore.js'
import { useMeterStore } from '../../store/useMeterStore.js'
import DataForm from '../../components/forms/DataForm.jsx'
import { Tag, Hash, Building2, Calendar, Clock, CheckCircle, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useDocumentTitle from '../../lib/useDocumentTitle.jsx';

const AddNewMeterPage = () => {
  useDocumentTitle('Dodaj miernik | Panel Elektropomiar');
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  console.log(queryParams);
  const { authUser } = useAuthStore();
  const { addMeter, isAdding } = useMeterStore();
  const [formData, setFormData] = useState({
    type: "",
    number: "",
    producer: "",
    checkDate: "",
    nextCheckIn: "",
    condition: "",
    comments: "",
    editedBy: authUser.fullName
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMeter(formData);
    setFormData({ type: "", number: "", producer: "", checkDate: "", nextcheckin: "", condition: "", comments: "", editedBy: authUser.fullName });
    navigate(`/mierniki?page=1&pageSize=10`);
  }
  return (
    <div>
      <DataForm
        fields={[
          { label: "Typ", icon: Tag, value: formData.type, onChange: (e) => setFormData({ ...formData, type: e.target.value }), placeholder: "Wprowadź typ" },
          { label: "Numer", icon: Hash, value: formData.number, onChange: (e) => setFormData({ ...formData, number: e.target.value }), placeholder: "Wprowadź numer" },
          { label: "Producent", icon: Building2, value: formData.producer, onChange: (e) => setFormData({ ...formData, producer: e.target.value }), placeholder: "Wprowadź producenta" },
          { label: "Termin sprawdzenia", icon: Calendar, value: formData.checkDate, onChange: (e) => setFormData({ ...formData, checkDate: e.target.value }), type: "date" },
          { label: "Następne sprawdzanie za", icon: Clock, value: formData.nextCheckIn, onChange: (e) => setFormData({ ...formData, nextcheckin: e.target.value }), type: "select", options: ["", 12, 13, 24] },
          { label: "Stan", icon: CheckCircle, value: formData.condition, onChange: (e) => setFormData({ ...formData, condition: e.target.value }), placeholder: "Wprowadź stan" },
          { label: "Uwagi", icon: FileText, value: formData.comments, onChange: (e) => setFormData({ ...formData, comments: e.target.value }), placeholder:"Wprowadź uwagi" }
        ]}
        onSubmit={handleSubmit}
        onCancel={() => {
          navigate('/mierniki?page=1&pageSize=10');
          setFormData({ editedBy: authUser.fullName });
        }}
        isSubmitting={isAdding}
        submitLabel="Dodaj nowy miernik"
      />
    </div>
  )
}

export default AddNewMeterPage
