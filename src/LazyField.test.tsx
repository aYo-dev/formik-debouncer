import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { Formik, Form } from "formik";
import { LazyField } from "./LazyField";

jest.mock("@ayovchev/react-debounce-callback-hook", () => ({
  useDebounceCallback: (fn: any) => fn,
}));

describe("LazyField onChange", () => {
  const TestInput = (props: any) => <input data-testid="input" {...props} />;
  const initialValues = { test: "" };

  it("calls onChange prop with debounced value", async () => {
    const handleChange = jest.fn();

    const { getByTestId } = render(
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <Form>
          <LazyField
            name="test"
            label="Test"
            Component={TestInput}
            onChange={handleChange}
            value=""
            delay={100}
          />
        </Form>
      </Formik>
    );

    const input = getByTestId("input");
    await act(async () => {
      fireEvent.change(input, { target: { value: "abc" } });
    });

    expect(handleChange).toHaveBeenCalledWith("abc");
  });

  it("updates value state and field value on change", async () => {
    const { getByTestId } = render(
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <Form>
          <LazyField
            name="test"
            label="Test"
            Component={TestInput}
            onChange={jest.fn()}
            value=""
            delay={100}
          />
        </Form>
      </Formik>
    );

    const input = getByTestId("input");
    await act(async () => {
      fireEvent.change(input, { target: { value: "xyz" } });
    });

    expect((input as HTMLInputElement).value).toBe("xyz");
  });

  it("uses default debounce delay if not provided", async () => {
    const handleChange = jest.fn();

    const { getByTestId } = render(
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <Form>
          <LazyField
            name="test"
            label="Test"
            Component={TestInput}
            onChange={handleChange}
            value=""
          />
        </Form>
      </Formik>
    );

    const input = getByTestId("input");
    await act(async () => {
      fireEvent.change(input, { target: { value: "default" } });
    });

    expect(handleChange).toHaveBeenCalledWith("default");
  });
});