import { renderHook, act } from '@testing-library/react';
import { FormikHelpers } from 'formik';

import { useDebounceFormik } from './useDebounceFormik';

const mockSubmit = jest.fn();

// Mock Formik helpers
const mockValidateForm = jest.fn();
const mockSetSubmitting = jest.fn();

describe('useDebounceFormik', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockValidateForm.mockClear();
    mockSetSubmitting.mockClear();
    mockSubmit.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call submit after validation when no errors', async () => {
    // Setup
    mockValidateForm.mockResolvedValue({}); // No errors
    const { result } = renderHook(() => useDebounceFormik(mockSubmit, 100));

    // Act: Call the submit callback with mocked Formik helpers
    await act(async () => {
      await result.current.onSubmit({ someData: 'test' }, {
        validateForm: mockValidateForm,
        setSubmitting: mockSetSubmitting,
      } as unknown as FormikHelpers<Record<string, string>>);
    });

    await act(async () => jest.advanceTimersByTime(100));

    // Assert: submit is called after validation with no errors
    expect(mockValidateForm).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalledWith(
      { someData: 'test' },
      expect.objectContaining({
        setSubmitting: mockSetSubmitting,
      }),
    );
    expect(mockSetSubmitting).toHaveBeenCalledWith(false);
  });

  it('should not call submit if validation errors exist', async () => {
    // Setup: simulate validation errors
    mockValidateForm.mockResolvedValue({ field: 'error' });
    const { result } = renderHook(() => useDebounceFormik(mockSubmit, 100));

    // Act: Call the submit callback
    await act(async () => {
      await result.current.onSubmit({ someData: 'test' }, {
        validateForm: mockValidateForm,
        setSubmitting: mockSetSubmitting,
      } as unknown as FormikHelpers<Record<string, string>>);
    });

    await act(async () => jest.advanceTimersByTime(100));

    // Assert: submit is not called due to validation errors
    expect(mockValidateForm).toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(mockSetSubmitting).toHaveBeenCalledWith(false);
  });

  it('should debounce the submit callback and wait for the delay', async () => {
    // Setup: simulate a valid form submission
    mockValidateForm.mockResolvedValue({});
    const { result } = renderHook(() => useDebounceFormik(mockSubmit, 100));

    // Act: Call the submit callback multiple times quickly
    await act(async () => {
      await result.current.onSubmit({ someData: 'test' }, {
        validateForm: mockValidateForm,
        setSubmitting: mockSetSubmitting,
      } as unknown as FormikHelpers<Record<string, string>>);
      await result.current.onSubmit({ someData: 'test' }, {
        validateForm: mockValidateForm,
        setSubmitting: mockSetSubmitting,
      } as unknown as FormikHelpers<Record<string, string>>);
    });

    // Assert: submit is not called immediately (debounce)
    expect(mockSubmit).not.toHaveBeenCalled();

    // Use jest's fake timers to fast-forward time and check if the submit gets called after debounce delay
    await act(async () => jest.advanceTimersByTime(100));

    // Assert: submit is called once after debounce delay
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it('should use default debounce delay if none is provided', () => {
    const { result } = renderHook(
      () => useDebounceFormik(mockSubmit), // No delay passed
    );

    expect(result.current.fieldProps.debounceDelay).toBe(500);
  });

  it('should use custom debounce delay if provided', () => {
    const { result } = renderHook(
      () => useDebounceFormik(mockSubmit, 1000), // Custom delay passed
    );

    expect(result.current.fieldProps.debounceDelay).toBe(1000);
  });
});
