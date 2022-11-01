import { useState } from "react";

export default function useForm(baseFormData, action) {
  const [formData, setFormData] = useState(baseFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    action(formData);
    console.log('hh');
    setFormData(baseFormData);
  };

  return { formData, handleChange, handleSubmit };
}