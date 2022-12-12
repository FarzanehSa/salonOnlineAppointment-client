import { useState } from "react";

export default function useDashForm(baseData, action) {
  const [formData, setFormData] = useState(baseData);
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    action(formData);
    setFormData(baseData);
  };

  return { formData, handleChange, handleSubmit };
}