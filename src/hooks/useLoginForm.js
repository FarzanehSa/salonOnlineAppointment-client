import { useState } from "react";

export default function useLoginForm(baseData, action, setError) {
  const [formData, setFormData] = useState(baseData);
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setError('')
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.tel) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
        setError('Input valid email!');
      } else if (!/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(formData.tel)) {
        setError('Input valid phone number!');
      } else if (formData.password.length < 6) {
        setError('Password must have 6 character length!');
      } else {
        action(formData);
        setFormData(baseData);
      }
    } else {
      action(formData);
      setFormData(baseData);
    }
  };

  return { formData, handleChange, handleSubmit };
}