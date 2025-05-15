# Formik Debouncer

The `useDebounceFormik` hook enhances [Formik](https://formik.org/) forms by introducing a debounce mechanism, making it ideal for form with debounced components like `input` or `textarea`. This ensures a smoother user experience by preventing data lost and proper form behaviour. While it works seamlessly with any debounced components, it is particularly optimized for use with [useDebounceCallback](https://github.com/aYo-dev/react-debounce-callback-hook), enabling consistent and efficient debounce behavior.

## Features

- **Debounced Form Submission**: Ensures that rapid changes in form fields do not trigger multiple submissions.
- **Centralized Debounce Configuration**: Provides a consistent way to configure debounce behavior across form fields.

## Installation

Install the required dependencies:

```bash
    npm install @ayovchev/formik-debouncer
```

## Usage

Here’s how you can use the `useDebounceFormik` hook in your project:

```typescript
import { useDebounceFormik } from './useDebounceFormik';
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
                    <Field name="name" {...fieldProps} />
                    <button type="submit" disabled={isSubmitting}>
                        Submit
                    </button>
                </Form>
            )}
        </Formik>
    );
};
```

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

- `fieldProps: { debounce: boolean; debounceDelay: number }`  
    Props to be spread onto form fields that support debouncing.

## Example Scenario

Imagine a scenario where a user is filling out a form with multiple fields. If the user quickly presses the submit button before the debounce delay expires, the `useDebounceFormik` hook ensures that:

1. The latest changes are captured.
2. The form is validated.
3. The form is submitted only if there are no validation errors.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
