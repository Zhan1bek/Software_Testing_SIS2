/* `||`, not `??`: on a fork without the BASE_URL variable, GitHub Actions passes an empty string. */
export const BASE_URL = process.env.BASE_URL || 'https://practicesoftwaretesting.com';
/* The Angular front end talks to this REST API; fixtures use it to seed users quickly. */
export const API_URL = process.env.API_URL || 'https://api.practicesoftwaretesting.com';
