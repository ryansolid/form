import { FieldGroupApi, functionalUpdate } from '@tanstack/form-core'
import { createComponent, createMemo, onSettled, untrack } from 'solid-js'
import { useSelector } from './useSelector'
import type { Component, Element, ParentProps } from 'solid-js'
import type {
  DeepKeysOfType,
  FieldGroupState,
  FieldsMap,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type { LensFieldComponent } from './createField'
import type { AppFieldExtendedSolidFormApi } from './createFormHook'

/**
 * @private
 */
export type AppFieldExtendedSolidFieldGroupApi<
  TFormData,
  TFieldGroupData,
  TFields extends
    | DeepKeysOfType<TFormData, TFieldGroupData | null | undefined>
    | FieldsMap<TFormData, TFieldGroupData>,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
  TFieldComponents extends Record<string, Component<any>>,
  TFormComponents extends Record<string, Component<any>>,
> = FieldGroupApi<
  TFormData,
  TFieldGroupData,
  TFields,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnDynamic,
  TOnDynamicAsync,
  TOnServer,
  TSubmitMeta
> &
  NoInfer<TFormComponents> & {
    AppField: LensFieldComponent<
      TFieldGroupData,
      TSubmitMeta,
      NoInfer<TFieldComponents>
    >
    AppForm: Component<ParentProps>
    /**
     * A solid component to render form fields. With this, you can render and manage individual form fields.
     */
    Field: LensFieldComponent<TFieldGroupData, TSubmitMeta>

    /**
     * A `Subscribe` function that allows you to listen and solid to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
     */
    Subscribe: <TSelected = NoInfer<FieldGroupState<TFieldGroupData>>>(props: {
      selector?: (state: NoInfer<FieldGroupState<TFieldGroupData>>) => TSelected
      children: ((state: NoInfer<TSelected>) => Element) | Element
    }) => Element
  }

export function createFieldGroup<
  TFormData,
  TFieldGroupData,
  TFields extends
    | DeepKeysOfType<TFormData, TFieldGroupData | null | undefined>
    | FieldsMap<TFormData, TFieldGroupData>,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TComponents extends Record<string, Component<any>>,
  TFormComponents extends Record<string, Component<any>>,
  TSubmitMeta = never,
>(
  opts: () => {
    form:
      | AppFieldExtendedSolidFormApi<
          TFormData,
          TOnMount,
          TOnChange,
          TOnChangeAsync,
          TOnBlur,
          TOnBlurAsync,
          TOnSubmit,
          TOnSubmitAsync,
          TOnDynamic,
          TOnDynamicAsync,
          TOnServer,
          TSubmitMeta,
          TComponents,
          TFormComponents
        >
      | AppFieldExtendedSolidFieldGroupApi<
          // Since this only occurs if you nest it within other form lenses, it can be more
          // lenient with the types.
          unknown,
          TFormData,
          string | FieldsMap<unknown, TFormData>,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          TSubmitMeta,
          TComponents,
          TFormComponents
        >
    fields: TFields
    defaultValues?: TFieldGroupData
    onSubmitMeta?: TSubmitMeta
    formComponents: TFormComponents
  },
): AppFieldExtendedSolidFieldGroupApi<
  TFormData,
  TFieldGroupData,
  TFields,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnDynamic,
  TOnDynamicAsync,
  TOnServer,
  TSubmitMeta,
  TComponents,
  TFormComponents
> {
  const options = untrack(opts)
  const api = new FieldGroupApi(options)
  const form =
    options.form instanceof FieldGroupApi
      ? (options.form.form as AppFieldExtendedSolidFormApi<
          TFormData,
          TOnMount,
          TOnChange,
          TOnChangeAsync,
          TOnBlur,
          TOnBlurAsync,
          TOnSubmit,
          TOnSubmitAsync,
          TOnDynamic,
          TOnDynamicAsync,
          TOnServer,
          TSubmitMeta,
          TComponents,
          TFormComponents
        >)
      : options.form

  const extendedApi: AppFieldExtendedSolidFieldGroupApi<
    TFormData,
    TFieldGroupData,
    TFields,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta,
    TComponents,
    TFormComponents
  > = api as never

  extendedApi.AppForm = (appFormProps) =>
    createComponent(form.AppForm, appFormProps)
  // The field options are resolved once, as the spread did in Solid 1.
  extendedApi.AppField = (props) =>
    createComponent(
      form.AppField,
      untrack(() => api.getFormFieldOptions(props)) as any,
    )
  extendedApi.Field = (props) =>
    createComponent(
      form.Field,
      untrack(() => api.getFormFieldOptions(props)) as any,
    )
  extendedApi.Subscribe = (props) => {
    const data = useSelector(api.store, props.selector)

    return createMemo(() =>
      functionalUpdate(props.children, data()),
    ) as unknown as Element
  }

  let mounted = false
  onSettled(() => {
    const cleanupFn = api.mount()
    mounted = true
    return () => {
      cleanupFn()
      mounted = false
    }
  })

  return Object.assign(extendedApi, {
    ...options.formComponents,
  }) as AppFieldExtendedSolidFieldGroupApi<
    TFormData,
    TFieldGroupData,
    TFields,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta,
    TComponents,
    TFormComponents
  >
}
