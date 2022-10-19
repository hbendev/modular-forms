/**
 * Creates a validation functions that validates total file size of a file list.
 *
 * @param requirement The maximum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxTotalSize(
  requirement: number,
  error: string
): (fieldValue: FileList | null | undefined) => string {
  return (fieldValue: FileList | null | undefined) =>
    [...(fieldValue || [])].reduce((size, file) => size + file.size, 0) >
    requirement
      ? error
      : '';
}
