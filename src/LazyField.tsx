import { useDebounceCallback } from "@ayovchev/react-debounce-callback-hook";
import { FieldAttributes, useField } from "formik";
import React from "react";

export const LazyField = <T,>({ label, Component, ...props }: FieldAttributes<T>) => {
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

  const hadleChange = (e: any) => {
    setValue(e.target.value);
    onChange(e.target.value);
  }

  return (
    <>
      <label>
        {label}
        <Component {...field} {...props} onChange={hadleChange} value={value} />
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};