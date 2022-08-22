import type React from 'react'
import { useEffect, useState } from 'react'
import type { TypedResponse } from '@remix-run/node'
import { json } from '@remix-run/node'
import type {
  FieldValues,
  UseFormProps,
  FieldPath,
  RegisterOptions,
  UseFormRegister,
  FormState,
  FieldError,
  UseFormReturn,
  SubmitErrorHandler,
  SubmitHandler
} from 'react-hook-form'
import type * as yup from 'yup'
import { useForm, useFormContext } from 'react-hook-form'
import type { AllowJustOne } from '~/types'

type CustomUseFormReturn<TFieldValues extends FieldValues = FieldValues> =
  UseFormReturn<TFieldValues> & {
    isValid: boolean
    setIsValid: (isValid: boolean) => void
  }

type CustomUseFormHandleSubmit<TFieldValues extends FieldValues> = (
  onValid?: SubmitHandler<TFieldValues>,
  onInvalid?: SubmitErrorHandler<TFieldValues>
) => (e?: React.BaseSyntheticEvent) => void

export type YupSchema<T> = Record<keyof T, yup.AnySchema<any, any, T[keyof T]>>

export interface ErrorResponse<T> {
  input: Partial<T>
  errors: {
    [K in keyof T]?: {
      message: string
      value: T[K]
    }
  }
}

type ValidateSchemaResponse<T> = AllowJustOne<{
  data?: T
  errorResponse?: TypedResponse<ErrorResponse<T>>
}>

export const validateSchema = async <T>(
  schema: yup.ObjectSchema<YupSchema<T>>,
  input: T
): Promise<ValidateSchemaResponse<T>> => {
  try {
    const result = await schema.validate(input, { abortEarly: false })

    return { data: result as T }
  } catch (error) {
    const errors: ErrorResponse<T>['errors'] = {}
    ;(error as yup.ValidationError).inner.forEach(({ path, message, value }) => {
      errors[path as keyof T] = {
        message,
        value
      }
    })
    return { errorResponse: json<ErrorResponse<T>>({ errors, input }) }
  }
}

export const getInputProps = <Form extends FieldValues>(
  register: UseFormRegister<Form>,
  formState: FormState<Form>
) => {
  return <TFieldName extends FieldPath<Form> = FieldPath<Form>>(
    name: TFieldName,
    {
      forceUpdate,
      errorResponse,
      ...options
    }: RegisterOptions<Form, TFieldName> & {
      forceUpdate?: boolean
      errorResponse?: ErrorResponse<Form>
    } = {}
  ) => {
    const mergedOptions = {
      required: true,
      ...options
    }
    const { ref: inputRef, ...values } = register(name, mergedOptions)

    const originalServerValue = errorResponse?.input[name]
    const serverErrorMessage = errorResponse?.errors?.[name]
    const defaultValue = originalServerValue ?? serverErrorMessage?.value
    const isTouched = forceUpdate || serverErrorMessage ? true : formState.touchedFields[name]
    const error = (formState.errors[name] || serverErrorMessage) as FieldError | undefined

    return {
      ...values,
      inputRef,
      error: !!(isTouched && error),
      required: !!mergedOptions.required,
      helperText: isTouched && error?.message,
      defaultValue
    }
  }
}

const getModelsAndOperations = <TFieldValues extends FieldValues = FieldValues>(
  form: CustomUseFormReturn<TFieldValues>
) => {
  const {
    handleSubmit: onSubmit,
    formState,
    reset,
    setValue,
    watch,
    clearErrors,
    register,
    control,
    getValues,
    setError,
    isValid,
    setIsValid
  } = form
  const isFullValid = formState.isValid && isValid

  const handleSubmit: CustomUseFormHandleSubmit<TFieldValues> = (onValid, onInvalid) => e => {
    const handleValidForm: SubmitHandler<TFieldValues> = (data, event) => {
      const target = event?.target as HTMLFormElement
      target.submit()
      return onValid?.(data, event)
    }

    return onSubmit(handleValidForm, onInvalid)(e)
  }

  const models = {
    form,
    errors: formState.errors,
    formState,
    isValid: isFullValid,
    isSubmitDisabled: typeof window !== 'undefined' ? !isFullValid : false,
    control
  }

  const operations = {
    reset,
    watch,
    setValue,
    onSubmit: handleSubmit,
    getValues,
    clearErrors,
    getInputProps: getInputProps(register, formState),
    setError,
    setIsValid
  }

  return [models, operations] as [typeof models, typeof operations]
}

export const useCustomForm = <TFieldValues extends FieldValues = FieldValues>(
  props?: UseFormProps<TFieldValues>
) => {
  const [isValid, setIsValid] = useState(true)
  const form = useForm<TFieldValues>({
    mode: 'all',
    shouldFocusError: true,
    ...props
  })

  const res = getModelsAndOperations({
    ...form,
    isValid,
    setIsValid
  })

  const { isSubmitDisabled } = res[0]

  useEffect(() => {
    if (!isSubmitDisabled) {
      form.clearErrors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitDisabled])

  return res
}

export const useCustomFormContext = <TFieldValues extends FieldValues = FieldValues>() => {
  const form = useFormContext<TFieldValues>() as CustomUseFormReturn<TFieldValues>

  return getModelsAndOperations(form)
}
