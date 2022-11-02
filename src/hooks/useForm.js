import { useState, useEffect } from "react";

export default function useForm(baseFormData, action) {
  const [formData, setFormData] = useState(baseFormData);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    action(formData);
    setFormData(baseFormData);
  };

  return { formData, handleChange, handleSubmit, handleChangeStylists };
}