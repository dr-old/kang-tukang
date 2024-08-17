import { useState, useEffect } from "react";

interface FormValues {
  [key: string]: string;
}

interface ValidationErrors {
  [key: string]: string | any;
}

interface ValidationRule {
  rule: (value: string, ...args: any[]) => { valid: boolean; message: string };
  args?: any[];
}

interface ValidationSchema {
  [key: string]: ValidationRule[] | any;
}

const useFormValidation = (
  initialValues: FormValues,
  schema: ValidationSchema,
  submit: () => void
) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      console.log("noErrors", noErrors);

      if (noErrors) {
        // Perform the form submission logic here
        submit();
        // setValues(initialValues);
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors, isSubmitting]);

  const handleChange = (name: keyof FormValues, value: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleBlur = (name: string) => {
    validateField(name);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    validateForm();
  };

  const validateField = (name: string) => {
    const rules = schema[name] || [];
    const errors: string[] = [];
    for (const rule of rules) {
      const { valid, message } = rule.rule(values[name], ...(rule.args || []));
      if (!valid) {
        errors.push(message);
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errors,
    }));
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    for (const [field, rules] of Object.entries(schema)) {
      const errors: string[] = [];
      for (const rule of rules) {
        const { valid, message } = rule.rule(
          values[field],
          ...(rule.args || [])
        );
        if (!valid) {
          errors.push(message);
        }
      }
      if (errors.length > 0) {
        newErrors[field] = errors;
      }
    }
    setErrors(newErrors);
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};

export default useFormValidation;
