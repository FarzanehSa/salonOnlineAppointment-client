import { useState } from "react";

export default function useLoginForm(baseData, action) {
  const [formData, setFormData] = useState(baseData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    action(formData);
    setFormData(baseData);
  };

  return { formData, handleChange, handleSubmit };
}