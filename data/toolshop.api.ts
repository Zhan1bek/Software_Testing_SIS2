import { APIRequestContext, expect } from '@playwright/test';
import { API_URL } from './env';
import { Address, User, toRegisterPayload } from './user.factory';

/**
 * The checkout validates the billing address against GET /postcode-lookup
 * ("The city does not belong to the selected country"), and the form auto-fills
 * street/city/state from that lookup. Taking the address from the same source keeps
 * the form consistent whichever value lands last.
 */
export async function lookUpAddress(request: APIRequestContext, address: Address): Promise<Address> {
  const response = await request.get(`${API_URL}/postcode-lookup`, {
    params: {
      country: address.country,
      postcode: address.postalCode,
      house_number: address.houseNumber,
    },
  });
  expect(response.status(), `postcode lookup: ${await response.text()}`).toBe(200);
  const found = await response.json();
  return {
    ...address,
    street: found.street,
    city: found.city,
    state: found.state,
  };
}

export async function registerUser(request: APIRequestContext, user: User): Promise<void> {
  const response = await request.post(`${API_URL}/users/register`, {
    data: toRegisterPayload(user),
  });
  expect(response.status(), `register ${user.email}: ${await response.text()}`).toBe(201);
}
