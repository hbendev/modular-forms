import { validate } from '../methods';
import type {
  FieldValues,
  ResponseData,
  FormStore,
  ReactivityDeps,
} from '../types';

/**
 * Value type of the submit options.
 */
type SubmitOptions = Partial<{
  keepResponse: boolean;
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldFocus: boolean;
}>;

/**
 * Handles the submission of the form.
 *
 * @param form The form to be submitted.
 * @param action The user-specific submit action.
 * @param options The submit options.
 * @param deps The function dependencies.
 *
 * @returns A submit event handler.
 */
export async function handleSubmit<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  deps: ReactivityDeps,
  form: FormStore<TFieldValues, TResponseData>,
  action: () => Promise<any>,
  options: SubmitOptions
): Promise<void> {
  // Destructure reactivity dependencies
  const { batch = (fn) => fn() } = deps;

  batch(() => {
    // Reset response if it is not to be kept
    if (!options.keepResponse) {
      form.response = {};
    }

    // Increase submit count and set submitted and submitting to "true"
    form.submitCount++;
    form.submitted = true;
    form.submitting = true;
  });

  // Try to run submit actions if form is valid
  try {
    if (await validate(deps, form, options)) {
      await action();
    }

    // If an error occurred, set error response
  } catch (error: any) {
    form.response = {
      status: 'error',
      message: error?.message || 'An unknown error has occurred.',
    };

    // Finally set submitting back to "false"
  } finally {
    form.submitting = false;
  }
}