import { randomUUID } from 'node:crypto';

export interface Address {
  street: string;
  houseNumber: string;
  city: string;
  state: string;
  /* ISO code — the value of the <select data-test="country"> option. */
  country: string;
  postalCode: string;
}

export interface User {
  firstName: string;
  lastName: string;
  /* YYYY-MM-DD, the format the registration form expects. */
  dob: string;
  phone: string;
  email: string;
  password: string;
  address: Address;
}

/**
 * Date.now() alone collides when parallel workers start in the same millisecond,
 * so a random suffix is added.
 */
function uniqueSuffix(): string {
  return `${Date.now()}${randomUUID().slice(0, 8)}`;
}

export function createUser(overrides: Partial<User> = {}): User {
  const id = uniqueSuffix();
  return {
    firstName: 'Test',
    lastName: `User${id.slice(-6)}`,
    dob: '1990-01-15',
    phone: '0612345678',
    /* example.com is reserved for testing and accepted by the app. */
    email: `pw.${id}@example.com`,
    /* Random part keeps it out of breached-password lists the API may check. */
    password: `Pw#${randomUUID().slice(0, 8)}Aa1!`,
    address: {
      street: 'Main Street',
      houseNumber: '12',
      city: 'Amsterdam',
      state: 'Noord-Holland',
      country: 'NL',
      postalCode: '1011AB',
    },
    ...overrides,
  };
}

/** Body for POST /users/register — same payload the registration form sends. */
export function toRegisterPayload(user: User) {
  return {
    first_name: user.firstName,
    last_name: user.lastName,
    dob: user.dob,
    phone: user.phone,
    email: user.email,
    password: user.password,
    address: {
      street: user.address.street,
      house_number: user.address.houseNumber,
      city: user.address.city,
      state: user.address.state,
      country: user.address.country,
      postal_code: user.address.postalCode,
    },
  };
}
