export const validateForm = ({setErrors, formData}) => {
    const newErrors = {}
    
    if (!formData.title.trim()) newErrors.title = 'Trip title is required'
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required'
    if (!formData.source.trim()) newErrors.source = 'Source location is required'
    if (!formData.category) newErrors.category = 'Please select a category'
    if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Valid budget is required'
    if (!formData.days || formData.days <= 0) newErrors.days = 'Valid duration is required'
    if (!formData.persons || formData.persons <= 0) newErrors.persons = 'Number of travelers is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    
    
    if (formData.startDate) {
      const start = new Date(formData.startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }