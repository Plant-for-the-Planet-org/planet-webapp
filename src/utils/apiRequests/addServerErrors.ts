export default function addServerErrors<T>(
    errors: { [P in keyof T]?: any },
    setError: (
      fieldName: keyof T,
      error: { type: string; message: string }
    ) => void
  ) {
    return Object.keys(errors).forEach((key) => {      
      if(errors[key as keyof T] && errors[key as keyof T].errors){
        setError(key as keyof T, {
          type: "server",
          message: errors[key as keyof T].errors!.join(". "),
        });
      }
    });
  }