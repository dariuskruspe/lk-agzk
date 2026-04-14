export function decodeBase64Url(input: string): string {
  // Replace non-url compatible chars with base64 standard chars
  let mod = input.replace(/-/g, '+').replace(/_/g, '/');

  // Pad out with standard base64 required padding characters
  const pad = mod.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error(
        'InvalidLengthError: Input base64url string is the wrong length to determine padding'
      );
    }
    mod += new Array(5 - pad).join('=');
  }

  return mod;
}
