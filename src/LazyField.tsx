import { useDebounceCallback } from "@ayovchev/react-debounce-callback-hook";
import { FieldAttributes, useField } from "formik";
import React from "react";

export const LazyField = <T,>({ Component, ...props }: FieldAttributes<T>) => {
  const [field, meta] = useField(props);
  const [value, setValue] = React.useState(props.value ?? '');

  const onChange = useDebounceCallback((value: string) => {
    field.onChange({
      target: {
        name: field.name,
        value: value,
      },
  })
    props.onChange(value);
  }, props.delay ?? 500);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    onChange(e.target.value);
  }

  return (
      <Component {...meta} {...field} {...props} onChange={handleChange} value={value} />
  );
};