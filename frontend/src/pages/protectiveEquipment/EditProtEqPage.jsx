import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProtectiveEquipmentStore } from '../../store/useProtectiveEquipmentStore.js'
import { useAuthStore } from '../../store/useAuthStore.js'
import DataForm from '../../components/forms/DataForm.jsx'
import { useNavigate } from 'react-router-dom'
import { Tag, Hash, Calendar, Clock, CheckCircle, FileText } from 'lucide-react'
import Loader from '../../components/ui/Loader.jsx'
import useDocumentTitle from '../../lib/useDocumentTitle.jsx';


const EditProtEqPage = () => {
  useDocumentTitle('Edycja sprzętu ochronnego | Panel Elektropomiar');
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEqById, updateEq, isUpdating } = useProtectiveEquipmentStore();
  const { authUser } = useAuthStore();
  const [eq, setEq] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchEq = async () => {
        const fetchedEq = await getEqById(id);
        setEq(fetchedEq);
      }
      fetchEq();
    } else {
      setEq(null);
    }
  }, [id, getEqById]);

  const [formData, setFormData] = useState({
    name: eq ? eq.name : "",
    factoryNumber: eq ? eq.factoryNumber : "",
    protocolNumber: eq ? eq.protocolNumber : "",
    checkDate: eq ? eq.checkDate : "",
    nextCheckDate: eq ? eq.nextCheckDate : "",
    comments: eq ? eq.comments : "",
    editedBy: eq ? eq.editedBy : authUser.fullName
  });

  useEffect(() => {
    if (eq) {
      setFormData({
        name: eq.name ?? "",
        factoryNumber: eq.factoryNumber ?? "",
        protocolNumber: eq.protocolNumber ?? "",
        checkDate: eq.checkDate ?? "",
        nextCheckDate: eq.nextCheckDate ?? "",
        comments: eq.comments ?? "",
        editedBy: authUser.fullName ?? ""
      });
    }
  }, [eq, authUser.fullName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateEq(eq.id, formData);
    setFormData({ name: "", factoryNumber: "", protocolNumber: "", checkDate: "", nextCheckDate: "", comments: "", editedBy: authUser.fullName });
    navigate('/sprzet-ochronny');
  }

  if (!eq) {
    return <Loader />;
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
          navigate('/sprzet-ochronny');
          setFormData({ editedBy: authUser.fullName });
        }}
        isSubmitting={isUpdating}
        submitLabel="Zapisz zmiany"
      />
    </div>
  )
}

export default EditProtEqPage
