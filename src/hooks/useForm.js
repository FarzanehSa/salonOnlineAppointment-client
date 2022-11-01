import { useState } from "react";

export default function useForm(baseFormData, action) {
  const [formData, setFormData] = useState(baseFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeStylists = (event) => {
    setFormData({ ...formData, stylists: event.target.value })
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    action(formData);
    setFormData(baseFormData);
  };

  return { formData, handleChange, handleSubmit, handleChangeStylists };
}