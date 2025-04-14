
import { faker } from "@faker-js/faker";
import { Borrower } from "@/types";

// Function to generate a random Borrower
export const createRandomBorrower = (): Borrower => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const isCompany = faker.datatype.boolean();

  return {
    id: 'B-' + faker.string.alphanumeric(8).toUpperCase(),
    firstName: firstName,
    lastName: lastName,
    companyName: isCompany ? faker.company.name() : undefined,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    dateOfBirth: faker.date.birthdate().toISOString().split('T')[0],
    ssn: faker.string.numeric(9),
    taxId: faker.string.numeric(9),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    creditScore: faker.number.int({ min: 300, max: 850 }),
    creditRating: faker.helpers.arrayElement(['Excellent', 'Good', 'Fair', 'Poor']),
    income: faker.number.int({ min: 30000, max: 200000 }),
    annualRevenue: isCompany ? faker.number.int({ min: 100000, max: 10000000 }) : undefined,
    employmentStatus: faker.helpers.arrayElement(['Employed', 'Self-Employed', 'Unemployed']),
    industry: isCompany ? faker.commerce.department() : undefined,
    yearsInBusiness: isCompany ? faker.number.int({ min: 1, max: 50 }) : undefined,
    employmentInfo: {
      employer: faker.company.name(),
      position: faker.person.jobTitle(),
      startDate: faker.date.past().toISOString().split('T')[0],
      endDate: faker.date.future().toISOString().split('T')[0],
    },
    relationshipManager: faker.person.fullName(),
    dateCreated: faker.date.past().toISOString(),
    dateUpdated: faker.date.recent().toISOString(),
  };
};
