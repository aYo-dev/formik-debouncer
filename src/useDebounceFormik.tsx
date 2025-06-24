import { useDebounceCallback } from '@ayovchev/react-debounce-callback-hook';
import { FormikHelpers } from 'formik';

export type useDebounceFormikSubmitType<T> = (
  data: T,
  helpers: FormikHelpers<T>,
) => void;

/**
 * This hook is important if you are using Formik and want to use the debounce feature for form components like input and textarea,
 * it ensures that if the user makes a change and presses the submit button quickly before the debounce delay expires, the latest data changes will not also be lost.
 * It also ensure that debounce is configured in a general place and returns the required field props for debounced input.
 * @param submit useDebounceFormikSubmitType
 * @param delay number
 * @returns debounced submit handler and required field's props
 */
export const useDebounceFormik = <T,>(
  submit: useDebounceFormikSubmitType<T>,
  delay?: number,
) => {
  const submitCb: useDebounceFormikSubmitType<T> = useDebounceCallback(
    (data: T, helpers: FormikHelpers<T>) => {
      // first we need to validate the form
      helpers.validateForm().then((errors) => {
        // check for errors and if there are no errors then submit the data
        if (Object.keys(errors).length === 0) {
          submit(data, helpers);
        }
        // at the ed we should form submitting value to false
        helpers.setSubmitting(false);
      });
    },
    delay,
  );

  return {
    onSubmit: submitCb,
    fieldProps: { debounce: true, delay: delay ?? 500 },
  };
};
