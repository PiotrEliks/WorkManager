import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMeterStore } from '../../store/useMeterStore.js'
import { useAuthStore } from '../../store/useAuthStore.js'
import DataForm from '../../components/DataForm.jsx'
import { useNavigate } from 'react-router-dom'
import { Tag, Hash, Building2, Calendar, Clock, CheckCircle, FileText } from 'lucide-react'
import Loader from '../../components/Loader.jsx'
import useDocumentTitle from '../../lib/useDocumentTitle.jsx';

const EditMeterPage = () => {
  useDocumentTitle('Edycja miernika | Panel Elektropomiar');
  const navigate = useNavigate();
  const { id } = useParams();
  const { getMeter, updateMeter, isUpdating } = useMeterStore();
  const { authUser } = useAuthStore();
  const [meter, setMeter] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchMeter = async () => {
        const fetchedMeter = await getMeter(id);
        setMeter(fetchedMeter);
      }
      fetchMeter();
    } else {
      setMeter(null);
    }
  }, [id, getMeter]);

  const [formData, setFormData] = useState({
    type: meter ? meter.type : "",
    number: meter ? meter.number : "",
    producer: meter ? meter.producer : "",
    checkdate: meter ? meter.checkdate : "",
    nextcheckin: meter ? meter.nextcheckin : "",
    condition: meter ? meter.condition : "",
    comments: meter ? meter.comments : "",
    editedBy: meter ? meter.editedBy : authUser.fullName
  });

  useEffect(() => {
    if (meter) {
      setFormData({
        type:        meter.type ?? "",
        number:      meter.number ?? "",
        producer:    meter.producer ?? "",
        checkdate:   meter.checkdate ?? "",
        nextcheckin: meter.nextcheckin ?? "",
        condition:   meter.condition ?? "",
        comments:    meter.comments ?? "",
        editedBy:    authUser.fullName ?? ""
      });
    }
  }, [meter, authUser.fullName]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMeter(meter.id, formData);
    setFormData({ type: "", number: "", producer: "", checkdate: "", nextcheckin: "", condition: "", comments: "", editedBy: authUser.fullName });
    navigate('/mierniki');
  }

  if (!meter) {
    return <Loader />;
  }

  return (
    <div>
      <DataForm
        fields={[
          { label: "Typ", icon: Tag, value: formData.type, onChange: (e) => setFormData({ ...formData, type: e.target.value }), placeholder: "Wprowadź typ" },
          { label: "Numer", icon: Hash, value: formData.number, onChange: (e) => setFormData({ ...formData, number: e.target.value }), placeholder: "Wprowadź numer" },
          { label: "Producent", icon: Building2, value: formData.producer, onChange: (e) => setFormData({ ...formData, producer: e.target.value }), placeholder: "Wprowadź producenta" },
          { label: "Termin sprawdzenia", icon: Calendar, value: formData.checkdate, onChange: (e) => setFormData({ ...formData, checkdate: e.target.value }), type: "date" },
          { label: "Następne sprawdzanie za", icon: Clock, value: formData.nextcheckin, onChange: (e) => setFormData({ ...formData, nextcheckin: e.target.value }), type: "select", options: ["", 12, 13, 24] },
          { label: "Stan", icon: CheckCircle, value: formData.condition, onChange: (e) => setFormData({ ...formData, condition: e.target.value }), placeholder: "Wprowadź stan" },
          { label: "Uwagi", icon: FileText, value: formData.comments, onChange: (e) => setFormData({ ...formData, comments: e.target.value }), placeholder:"Wprowadź uwagi" }
        ]}
        onSubmit={handleSubmit}
        onCancel={() => {
          navigate('/mierniki');
          setFormData({ editedBy: authUser.fullName });
        }}
        isSubmitting={isUpdating}
        submitLabel="Zaktualizuj miernik"
      />
    </div>
  )
}

export default EditMeterPage
