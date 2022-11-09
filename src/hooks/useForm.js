import { useState, useEffect } from "react";

export default function useForm(baseFormData, action) {
  const [formData, setFormData] = useState(baseFormData);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (formData.stylists.length !== 0) {

      const myGroup = formData.service.groupid;
      const myStylists = formData.stylists.filter(stylist => stylist.skills.indexOf(myGroup) > -1)
      setFormData(formData => ({ ...formData, stylists: myStylists }));
    }
  }, [formData.service])

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(formData => ({ ...formData, [name]: value }));
  };

  const handleChangeStylists = (event) => {
    setFormData(formData => ({ ...formData, stylists: event.target.value }))
  };

  const handleChangeDate = (newDate) => {
    
    // make sure from-date is always smaller that to-date
    if (newDate >= now){
      setFormData({ ...formData, date: newDate });
    }
    else {
      setFormData({ ...formData, date: now });
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    action(formData);
    // setFormData(baseFormData);
  };

  return { formData, handleChange, handleSubmit, handleChangeStylists, handleChangeDate };
}