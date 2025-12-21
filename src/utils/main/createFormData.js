export const createFormData = (values) => {
    const formData = new FormData();
  
    const appendFormData = (formData, prefix, object) => {
      if (object instanceof File || object instanceof Blob) {
        formData.append(prefix, object);
      } else if (typeof object === "object" && object !== null) {
        Object.keys(object).forEach((key) => {
          const value = object[key];
          const newKey = prefix ? `${prefix}[${key}]` : key;
  
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              const arrayKey = `${newKey}[${index}]`;
              if (item !== undefined && item !== null && item !== "") {
                appendFormData(formData, arrayKey, item);
              }
            });
          } else {
            if (value !== undefined && value !== null && value !== "") {
              appendFormData(formData, newKey, value);
            }
          }
        });
      } else {
        if (object !== undefined && object !== null && object !== "") {
          formData.append(prefix, object);
        }
      }
    };
  
    Object.keys(values).forEach((key) => {
      appendFormData(formData, key, values[key]);
    });
  
    return formData;
  };