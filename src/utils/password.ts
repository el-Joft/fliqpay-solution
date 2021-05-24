import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(
    parseInt(process.env.SALT_ROUND as string)
  );
  return bcrypt.hashSync(password, salt);
}

/**
 *
 * @function
 * This function verifies a password input
 * @param password {String}.
 * @return {Boolean}
 */
export async function verifyPasswordMatch(
  rawPassword: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(rawPassword, hash);
}
