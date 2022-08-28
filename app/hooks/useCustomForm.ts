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
import type { SubmitFunction } from '@remix-run/react'
import { useTransition, useSubmit } from '@remix-run/react'
import type { Transition } from '@remix-run/react/dist/transition'
import type { AllowJustOne } from '~/types'

type CustomUseFormReturn<TFieldValues extends FieldValues = FieldValues> =
  UseFormReturn<TFieldValues> & {
    isValid: boolean
    setIsValid: (isValid: boolean) => void
    sendSubmit?: SubmitFunction
    transition?: Transition
    errorResponse?: ErrorResponse<TFieldValues>
  }

type CustomUseFormHandleSubmit<TFieldValues extends FieldValues> = (
  onValid?: SubmitHandler<TFieldValues>,
  onInvalid?: SubmitErrorHandler<TFieldValues>
) => (e?: React.BaseSyntheticEvent) => void

export type YupSchema<T> = Record<keyof T, yup.AnySchema<any, any, T[keyof T]>>

export interface CustomUseFormProps<TFieldValues extends FieldValues = FieldValues>
  extends UseFormProps<TFieldValues> {
  errorResponse?: ErrorResponse<TFieldValues>
}

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
  formState: FormState<Form>,
  { errorResponse }: { errorResponse?: ErrorResponse<Form> } = {}
) => {
  return <TFieldName extends FieldPath<Form> = FieldPath<Form>>(
    name: TFieldName,
    {
      forceUpdate,
      ...options
    }: RegisterOptions<Form, TFieldName> & {
      forceUpdate?: boolean
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
    const error = (formState.errors?.[name] || serverErrorMessage) as FieldError | undefined

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
    setIsValid,
    sendSubmit,
    transition,
    errorResponse
  } = form
  const isFullValid = formState.isValid && isValid
  const isLoading = transition?.state === 'submitting'
  const isRedirecting = transition?.state === 'loading'

  const handleSubmit: CustomUseFormHandleSubmit<TFieldValues> = (onValid, onInvalid) => e => {
    const handleValidForm: SubmitHandler<TFieldValues> = (data, event) => {
      const target = event?.target as HTMLFormElement
      sendSubmit?.(target)
      return onValid?.(data, event)
    }

    return onSubmit(handleValidForm, onInvalid)(e)
  }

  const isSubmitDisabled = formState.isDirty ? !isFullValid : false

  const models = {
    form,
    errors: formState.errors,
    formState,
    isValid: isFullValid,
    isSubmitDisabled: typeof window !== 'undefined' ? isSubmitDisabled : false,
    control,
    isLoading,
    isRedirecting
  }

  const operations = {
    reset,
    watch,
    setValue,
    onSubmit: typeof window !== 'undefined' ? () => () => {} : handleSubmit,
    getValues,
    clearErrors,
    getInputProps: getInputProps(register, formState, { errorResponse }),
    setError,
    setIsValid
  }

  return [models, operations] as [typeof models, typeof operations]
}

export const useCustomForm = <TFieldValues extends FieldValues = FieldValues>({
  errorResponse,
  ...props
}: CustomUseFormProps<TFieldValues> = {}) => {
  const [isValid, setIsValid] = useState(true)
  const form = useForm<TFieldValues>({
    mode: 'all',
    shouldFocusError: true,
    ...props
  })
  const sendSubmit = useSubmit()
  const transition = useTransition()

  const res = getModelsAndOperations({
    ...form,
    isValid,
    setIsValid,
    sendSubmit,
    transition,
    errorResponse
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

export const createCustomForm = <T>(props?: CustomUseFormProps<T>) => {
  return (newProps?: CustomUseFormProps<T>) => {
    return useCustomForm({ ...props, ...newProps })
  }
}

export const useCustomFormContext = <TFieldValues extends FieldValues = FieldValues>() => {
  const form = useFormContext<TFieldValues>() as CustomUseFormReturn<TFieldValues>

  return getModelsAndOperations(form)
}
