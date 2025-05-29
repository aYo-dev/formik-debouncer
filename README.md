# Formik Debouncer

The `useDebounceFormik` hook enhances [Formik](https://formik.org/) forms by introducing a debounce mechanism, making it ideal for forms with debounced components like `input` or `textarea`. This ensures a smoother user experience by preventing data loss and ensuring proper form behavior. While it works seamlessly with any debounced components, it is particularly optimized for use with [useDebounceCallback](https://github.com/aYo-dev/react-debounce-callback-hook), enabling consistent and efficient debounce behavior.

## Features

- **Enhanced Formik Performance**: Decreases the frequency of rerenderings caused by state changes.
- **Debounced Form Submission**: Prevents multiple rapid submissions by debouncing the submit handler.
- **Centralized Debounce Configuration**: Easily configure debounce delay for all form fields in one place.
- **Optimized for Debounced Inputs**: Works seamlessly with debounced components like `input` or `textarea`.
- **Integration with useDebounceCallback**: Designed to work efficiently with [useDebounceCallback](https://github.com/aYo-dev/react-debounce-callback-hook).
- **Improved User Experience**: Reduces data loss and ensures proper form behavior during fast user interactions.

## Installation

Install the required dependency:

```bash
npm install @ayovchev/formik-debouncer
```

## Usage

### useDebounceFormik

Here’s how you can use it in your project:

```tsx
import { useDebounceFormik, LazyField } from '@ayovchev/formik-debouncer';
import { Formik, Form, Field } from 'formik';

const MyForm = () => {
  const { onSubmit, fieldProps } = useDebounceFormik(
    (data, helpers) => {
      console.log('Form submitted with data:', data);
      helpers.resetForm();
    },
    300 // debounce delay in milliseconds
  );

  return (
    <Formik
      initialValues={{ name: '' }}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <LazyField 
            {...fieldProps}
            name="name"
            label="Name"
            Component="input"
            onChange={value => console.log(value)}
            />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};
```

### Demo

Check out the live demo on [StackBlitz](https://stackblitz.com/edit/vitejs-vite-7ujwcekl?file=src%2FApp.tsx)

## API

### `useDebounceFormik`

#### Parameters

- `submit: useDebounceFormikSubmitType<T>`  
  A callback function that handles the form submission. It receives the form data and Formik helpers as arguments.

- `delay?: number`  
  The debounce delay in milliseconds. Defaults to `500ms` if not provided.

#### Returns

- `onSubmit: (data: T, helpers: FormikHelpers<T>) => void`  
  A debounced submit handler to be passed to Formik's `onSubmit`.

- `fieldProps: { debounce: boolean; delay: number }`  
  Props to be spread onto form fields that support debouncing.

### `LazyField` Props

- `name`: string — The field name.
- `label`: string — The label for the field.
- `Component`: React component or string (e.g., `"input"`, `"textarea"`).
- `delay`: number (optional) — Debounce delay in ms.
- `onChange`: function — Callback for value changes.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.